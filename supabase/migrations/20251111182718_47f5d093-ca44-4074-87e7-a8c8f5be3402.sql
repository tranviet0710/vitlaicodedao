-- Fix update_updated_at_column function with proper search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

-- Create support_requests table for user inquiries
CREATE TABLE public.support_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on support_requests
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for support_requests
CREATE POLICY "Anyone can insert support requests"
ON public.support_requests
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view all support requests"
ON public.support_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update support requests"
ON public.support_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete support requests"
ON public.support_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add updated_at trigger to support_requests
CREATE TRIGGER update_support_requests_updated_at
BEFORE UPDATE ON public.support_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();