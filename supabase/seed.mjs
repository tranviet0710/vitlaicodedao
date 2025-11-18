import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import dotenv from 'dotenv';

// Explicitly load .env file from the project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in your .env file.');
  throw new Error('Supabase URL and service key are required.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const seedDir = path.join(process.cwd(), 'supabase', 'seed');

// Defines the order of seeding to respect foreign key constraints.
const seedOrder = [
  'seo_settings.csv',
  'projects.csv',
  'blogs.csv',
  'testimonials.csv'
];

// Function to transform data before insertion
function transformData(tableName, data) {
  return data.map(row => {
    const newRow = {};
    for (const key in row) {
      if (row[key] === '') {
        newRow[key] = null;
      } else {
        newRow[key] = row[key];
      }
    }

    // Special handling for specific tables
    if (tableName === 'projects' && newRow.tech_stack && typeof newRow.tech_stack === 'string') {
      try {
        const cleanedString = newRow.tech_stack.replace(/""/g, '"');
        newRow.tech_stack = JSON.parse(cleanedString);
      } catch (e) {
        console.error(`Error parsing tech_stack for project: ${newRow.title}`, e);
        newRow.tech_stack = []; // Default to empty array on error
      }
    }
    
    if (tableName === 'blogs' && newRow.id === null) {
        delete newRow.id;
    }

    return newRow;
  });
}


async function seed() {
  try {
    for (const file of seedOrder) {
      const tableName = path.parse(file).name; // Extracts table name from filename (e.g., 'blogs.csv' -> 'blogs')
      const filePath = path.join(seedDir, file);

      if (!fs.existsSync(filePath)) {
        console.warn(`Warning: Seed file not found, skipping: ${file}`);
        continue;
      }

      const csvData = fs.readFileSync(filePath, 'utf8');

      const { data: parsedData, errors: parseErrors } = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
        delimiter: ';',
      });

      if (parseErrors.length > 0) {
        console.error(`Errors parsing ${file}:`, parseErrors);
        continue;
      }

      if (parsedData.length > 0) {
        const transformedData = transformData(tableName, parsedData);
        const { error } = await supabase.from(tableName).insert(transformedData);
        if (error) {
          console.error(`Error seeding table ${tableName}:`, error);
        } else {
          console.log(`Successfully seeded table ${tableName}`);
        }
      }
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seed();