-- ZORROXO database schema
-- Tables will be added during Supabase integration.

CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL DEFAULT 0,
    category TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
