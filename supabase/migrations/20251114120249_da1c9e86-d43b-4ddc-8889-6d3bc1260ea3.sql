-- Create SEO settings table
CREATE TABLE IF NOT EXISTS public.seo_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  og_type TEXT DEFAULT 'website',
  twitter_card TEXT DEFAULT 'summary_large_image',
  twitter_site TEXT,
  canonical_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.seo_settings ENABLE ROW LEVEL SECURITY;

-- Create policies - anyone can read SEO settings (public data)
CREATE POLICY "SEO settings are viewable by everyone" 
ON public.seo_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can insert SEO settings" 
ON public.seo_settings 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can update SEO settings" 
ON public.seo_settings 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Only authenticated users can delete SEO settings" 
ON public.seo_settings 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_seo_settings_updated_at
BEFORE UPDATE ON public.seo_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default SEO settings for main pages
INSERT INTO public.seo_settings (page_key, title, description, keywords, og_title, og_description) VALUES
('home', 'Viet Dev - Full-Stack Developer & AI Enthusiast', 'Professional full-stack developer specializing in React, Node.js, and AI integration. Building modern web applications with cutting-edge technologies.', 'full-stack developer, React, Node.js, AI, machine learning, web development', 'Viet Dev - Full-Stack Developer & AI Enthusiast', 'Professional full-stack developer specializing in React, Node.js, and AI integration'),
('blog', 'Blog - Viet Dev', 'Read the latest articles about web development, AI, and technology insights.', 'blog, web development, AI, technology, tutorials', 'Blog - Viet Dev', 'Read the latest articles about web development, AI, and technology'),
('projects', 'Projects - Viet Dev', 'Explore my portfolio of web applications and AI-powered projects.', 'portfolio, projects, web applications, AI projects', 'Projects - Viet Dev', 'Explore my portfolio of web applications and AI-powered projects');
