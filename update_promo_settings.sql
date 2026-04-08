-- SQL to update promo_settings table with video banner features
-- Run this in your Supabase SQL Editor

ALTER TABLE public.promo_settings 
ADD COLUMN IF NOT EXISTS video_banner_url TEXT,
ADD COLUMN IF NOT EXISTS video_banner_heading TEXT,
ADD COLUMN IF NOT EXISTS video_banner_subtext TEXT,
ADD COLUMN IF NOT EXISTS video_banner_cta TEXT,
ADD COLUMN IF NOT EXISTS video_banner_cta_link TEXT;

-- Enable Realtime for this table specifically if not already enabled via ALL TABLES
-- (Already enabled via FOR ALL TABLES in setup script, but good to be sure)
ALTER TABLE public.promo_settings REPLICA IDENTITY FULL;
