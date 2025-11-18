
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey || !geminiApiKey) {
  throw new Error(
    "Missing environment variables. Please provide VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and GEMINI_API_KEY."
  );
}

// Initialize clients
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Function to generate embedding
async function getEmbedding(text) {
  const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001"});
  const response = await embeddingModel.embedContent(text);
  return response.embedding.values;
}

// Function to chunk text
function chunkText(text, chunkSize = 500) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
}


async function ingestData() {
  console.log("Starting data ingestion...");

  // 1. Clear existing documents
  console.log("Deleting old documents...");
  const { error: deleteError } = await supabase.from('documents').delete().neq('id', 0);
  if (deleteError) {
    console.error("Error deleting old documents:", deleteError);
    return;
  }

  // 2. Ingest Personal Info
  console.log("Ingesting personal information...");
  const personalInfo = `
    Viet Dev is a passionate and experienced software engineer specializing in web development. 
    He has a strong background in creating modern, responsive, and user-friendly web applications using technologies like React, Next.js, Node.js, and TypeScript. 
    He is proficient in both frontend and backend development and has experience with cloud platforms like Vercel and Supabase. 
    Viet is a strong advocate for clean code, testing, and agile methodologies. He is always eager to learn new technologies and improve his skills.
  `;
  const personalChunks = chunkText(personalInfo);
  for (const chunk of personalChunks) {
    const embedding = await getEmbedding(chunk);
    await supabase.from('documents').insert({
      content: chunk,
      metadata: { source: 'personal_info' },
      embedding: embedding,
    });
  }
  console.log("Personal information ingested.");


  // 3. Ingest Blogs
  console.log("Ingesting blog posts...");
  const { data: blogs, error: blogsError } = await supabase.from('blogs').select('title, content, slug');
  if (blogsError) {
    console.error("Error fetching blogs:", blogsError);
    return;
  }

  for (const blog of blogs) {
    const fullContent = `Blog Title: ${blog.title}. Content: ${blog.content}`;
    const chunks = chunkText(fullContent);
    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);
      await supabase.from('documents').insert({
        content: chunk,
        metadata: { source: 'blog', slug: blog.slug, title: blog.title },
        embedding: embedding,
      });
    }
  }
  console.log(`${blogs.length} blog posts ingested.`);

  // 4. Ingest Projects
  console.log("Ingesting projects...");
  const { data: projects, error: projectsError } = await supabase.from('projects').select('title, description, slug');
  if (projectsError) {
    console.error("Error fetching projects:", projectsError);
    return;
  }

  for (const project of projects) {
    const fullContent = `Project Name: ${project.title}. Description: ${project.description}`;
    const chunks = chunkText(fullContent);
    for (const chunk of chunks) {
      const embedding = await getEmbedding(chunk);
      await supabase.from('documents').insert({
        content: chunk,
        metadata: { source: 'project', slug: project.slug, name: project.title },
        embedding: embedding,
      });
    }
  }
  console.log(`${projects.length} projects ingested.`);

  console.log("Data ingestion complete!");
}

ingestData();
