-- SUPABASE DATABASE SETUP SCRIPT
-- 1. Login to your Supabase Dashboard (https://app.supabase.com)
-- 2. Open the SQL Editor on the left sidebar
-- 3. Click "New Query" and paste the code below
-- 4. Click "Run" (Bottom Right)

-- 1. Create ORDERS Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    date TIMESTAMPTZ DEFAULT now(),
    items JSONB NOT NULL,
    subtotal NUMERIC NOT NULL,
    discount NUMERIC DEFAULT 0,
    shipping NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    status TEXT DEFAULT 'Pending',
    shipping_details JSONB NOT NULL,
    promo_code TEXT
);

-- 2. Create PRODUCTS Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    rating NUMERIC DEFAULT 4.5,
    reviews INTEGER DEFAULT 0,
    category TEXT,
    images TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    colors JSONB DEFAULT '[]',
    stock INTEGER DEFAULT 10,
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_top_in_category BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create CATEGORIES Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT,
    product_count INTEGER DEFAULT 0
);

-- 4. Create PROMO SETTINGS Table
CREATE TABLE IF NOT EXISTS public.promo_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    tagline TEXT,
    title1 TEXT,
    title_accent TEXT,
    title2 TEXT,
    code TEXT,
    description TEXT,
    button_text TEXT,
    background_image TEXT,
    video_url TEXT,
    second_video_url TEXT
);

-- 5. Create HERO SETTINGS Table
CREATE TABLE IF NOT EXISTS public.hero_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    season_text TEXT,
    accent_title TEXT,
    title TEXT,
    subtitle TEXT,
    background_image TEXT,
    button_text TEXT
);

-- 6. Enable Access (Policy to allow anyone to READ/WRITE for the boutique store)
DO $$
BEGIN
    ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.promo_settings ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Drop existing generic policies if any, then add permissive ones
DROP POLICY IF EXISTS "Public Access" ON public.orders;
DROP POLICY IF EXISTS "Public Access" ON public.products;
DROP POLICY IF EXISTS "Public Access" ON public.categories;
DROP POLICY IF EXISTS "Public Access" ON public.promo_settings;
DROP POLICY IF EXISTS "Public Access" ON public.hero_settings;

CREATE POLICY "Public Access" ON public.orders FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON public.products FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON public.categories FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON public.promo_settings FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Public Access" ON public.hero_settings FOR ALL TO public USING (true) WITH CHECK (true);

-- 7. Enable REALTIME synchronization
-- Re-create the publication to include all tables
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
