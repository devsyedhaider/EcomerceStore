-- SQL to update products table with new organization features
-- Run this in your Supabase SQL Editor

ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS materials TEXT,
ADD COLUMN IF NOT EXISTS warranty_policy TEXT,
ADD COLUMN IF NOT EXISTS shipping_returns TEXT,
ADD COLUMN IF NOT EXISTS care_instructions TEXT;
