
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and service key are required.');
}

const supabase = createClient(supabaseUrl, supabaseKey);
const seedDir = path.join(process.cwd(), 'supabase', 'seed');

async function seed() {
  try {
    const files = fs.readdirSync(seedDir).filter(file => file.endsWith('.csv'));

    for (const file of files) {
      const tableName = file.split('-')[0];
      const filePath = path.join(seedDir, file);
      const csvData = fs.readFileSync(filePath, 'utf8');

      const { data: parsedData } = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsedData.length > 0) {
        const { error } = await supabase.from(tableName).insert(parsedData);
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
