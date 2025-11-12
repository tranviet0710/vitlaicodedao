-- Make author_id nullable in blogs table
ALTER TABLE blogs ALTER COLUMN author_id DROP NOT NULL;