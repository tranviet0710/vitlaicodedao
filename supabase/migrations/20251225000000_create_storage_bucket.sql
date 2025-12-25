-- Create a public bucket named 'assets'
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow public read access to the 'assets' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'assets' );

-- Policy to allow authenticated users to upload to the 'assets' bucket
CREATE POLICY "Authenticated Users Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'assets' );

-- Policy to allow authenticated users to update their own uploads (optional but good practice)
-- simplistic approach: allow auth users to update any file in this bucket for now, 
-- or restrict based on path if we had user specific folders. 
-- For admin use case, generally authenticated users are admins or trusted.
CREATE POLICY "Authenticated Users Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'assets' );

-- Policy to allow authenticated users to delete files
CREATE POLICY "Authenticated Users Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'assets' );
