
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.80.0";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.15.0";

// Basic CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

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

    // 1. Generate embedding for the user's message
    const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });
    const embeddingResponse = await embeddingModel.embedContent(message);
    const queryEmbedding = embeddingResponse.embedding.values;

    // 2. Search for relevant documents in Supabase
    const { data: documents, error: rpcError } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_threshold: 0.78, // Adjust threshold as needed
      match_count: 5,        // Number of documents to retrieve
    });

    if (rpcError) {
      console.error("Error matching documents:", rpcError);
      return new Response(JSON.stringify({ error: "Failed to retrieve context" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    // 3. Construct prompt for Gemini
    const context = documents.map((doc: any) => doc.content).join("\n\n");
    const prompt = `You are a helpful assistant for Viet Dev's portfolio website. Answer the user's question based ONLY on the provided context. If the answer is not in the context, politely state that you don't have enough information to answer.

Context:
${context}

User Question: ${message}

Answer:`;

    // 4. Get response from Gemini
    const generativeModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const result = await generativeModel.generateContent(prompt);
    const responseText = result.response.text();

    return new Response(JSON.stringify({ reply: responseText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Chat agent error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
