
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.15.0";
// import { extractText } from "https://esm.sh/@pdf/pdftext@1.0.0"; // Assuming this is the correct import path

// Basic CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Function to chunk text (copied from ingest.mjs)
function chunkText(text: string, chunkSize = 500) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
}

serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { text, pdfBase64, metadata, filename } = await req.json();

    if (!text && !pdfBase64) {
      return new Response(JSON.stringify({ error: "Either 'text' or 'pdfBase64' is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    let contentToIngest = "";
    let sourceMetadata = metadata || {};

    // if (pdfBase64) {
    //   // Decode base64 PDF
    //   const pdfBytes = Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0));
    //   contentToIngest = await extractText(pdfBytes);
    //   sourceMetadata = { ...sourceMetadata, source: "pdf_upload", filename: filename || "uploaded_pdf.pdf" };
    // } else {
    contentToIngest = text;
    sourceMetadata = { ...sourceMetadata, source: "manual_ingestion" };
    // }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Initialize Gemini client
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not set" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    const genAI = new GoogleGenerativeAI(geminiApiKey);

    // Function to generate embedding
    async function getEmbedding(text: string) {
      const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001"});
      const response = await embeddingModel.embedContent(text);
      return response.embedding.values;
    }

    const chunks = chunkText(contentToIngest);
    const documentsToInsert = [];

    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);
      documentsToInsert.push({
        content: chunk,
        metadata: sourceMetadata,
        embedding: embedding,
      });
    }

    // Insert the documents into the 'documents' table
    const { error: insertError } = await supabase.from('documents').insert(documentsToInsert);

    if (insertError) {
      console.error("Error inserting document(s):", insertError);
      return new Response(JSON.stringify({ error: "Failed to ingest document(s)" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    return new Response(JSON.stringify({ message: "Document(s) ingested successfully" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Ingest document error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
