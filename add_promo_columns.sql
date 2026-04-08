-- Add missing image columns to promo_settings table
-- Execute this in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

ALTER TABLE promo_settings 
ADD COLUMN IF NOT EXISTS second_background_image TEXT,
ADD COLUMN IF NOT EXISTS video_banner_background_image TEXT;

-- Verify the columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'promo_settings';
