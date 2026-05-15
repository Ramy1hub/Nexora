-- ============================================
-- NEXORA DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  avatar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  old_price DECIMAL(10, 2),
  category TEXT NOT NULL DEFAULT 'templates',
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  thumbnail TEXT,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  preview_video TEXT,
  demo_url TEXT,
  zip_file TEXT,
  sales INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  rating DECIMAL(3, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('paypal', 'vodafone_cash')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  transaction_id TEXT,
  order_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- DOWNLOADS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  download_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  type TEXT NOT NULL DEFAULT 'system' CHECK (type IN ('order', 'system', 'review', 'download')),
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- WISHLIST TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON public.downloads(user_id);

-- ============================================
-- RLS POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- USERS policies
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can insert user profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Admins can view all users" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- PRODUCTS policies (public read, admin write)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ORDERS policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- DOWNLOADS policies
CREATE POLICY "Users can view own downloads" ON public.downloads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create downloads" ON public.downloads FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update downloads" ON public.downloads FOR UPDATE USING (auth.uid() = user_id);

-- NOTIFICATIONS policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (
  user_id IS NULL OR auth.uid() = user_id
);
CREATE POLICY "Anyone can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (
  auth.uid() = user_id OR user_id IS NULL
);

-- REVIEWS policies
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- WISHLIST policies
CREATE POLICY "Users can view own wishlist" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from wishlist" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to increment product sales
CREATE OR REPLACE FUNCTION increment_sales(product_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET sales = sales + 1
  WHERE id = product_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment product views
CREATE OR REPLACE FUNCTION increment_views(product_id_param UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.products
  SET views = views + 1
  WHERE id = product_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TRIGGER: Auto-create user profile on signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, role, avatar)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    'user',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- REALTIME
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- ============================================
-- SEED DATA: Demo Products
-- ============================================
INSERT INTO public.products (title, slug, description, features, price, old_price, category, tags, thumbnail, images, demo_url, sales, views, rating) VALUES
(
  'Quantum Dashboard Pro',
  'quantum-dashboard-pro',
  'A stunning admin dashboard template built with React and Tailwind CSS. Features real-time analytics, advanced charts, dark mode, and 50+ pre-built components.',
  '["React 18 + TypeScript", "50+ Components", "Dark & Light Mode", "Real-time Analytics", "Responsive Design", "Chart.js Integration"]'::jsonb,
  49, 79, 'dashboards',
  '["react", "dashboard", "admin", "analytics"]'::jsonb,
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
  '["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"]'::jsonb,
  'https://example.com/demo',
  1247, 15680, 4.8
),
(
  'Nova Landing Page Kit',
  'nova-landing-page-kit',
  '12 beautiful landing page templates for SaaS products, startups, and agencies. Fully responsive with smooth animations.',
  '["12 Unique Designs", "Framer Motion Animations", "SEO Optimized", "Contact Form Ready", "Newsletter Integration", "Mobile First"]'::jsonb,
  39, 59, 'landing-pages',
  '["landing-page", "saas", "startup", "responsive"]'::jsonb,
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop',
  '["https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop"]'::jsonb,
  'https://example.com/demo',
  892, 12340, 4.9
),
(
  'E-Commerce Pro Template',
  'e-commerce-pro-template',
  'Full-featured e-commerce website template with product management, cart, checkout, and payment integration. Built with Next.js.',
  '["Next.js 14", "Shopping Cart", "Stripe Integration", "Product Management", "Order Tracking", "SEO Optimized"]'::jsonb,
  89, 129, 'websites',
  '["ecommerce", "nextjs", "stripe", "shopping"]'::jsonb,
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
  '["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"]'::jsonb,
  'https://example.com/demo',
  1567, 22340, 4.9
),
(
  'Starter UI Kit',
  'starter-ui-kit',
  'A comprehensive UI kit with 200+ components designed in Figma with coded React components. Perfect for rapid prototyping.',
  '["200+ Components", "Figma Source Files", "React Components", "Design Tokens", "Accessibility Ready", "Documentation"]'::jsonb,
  69, 99, 'ui-kits',
  '["ui-kit", "figma", "react", "components"]'::jsonb,
  'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
  '["https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=600&fit=crop"]'::jsonb,
  'https://example.com/demo',
  723, 10450, 4.7
),
(
  'Pixel Quest - HTML5 Game',
  'pixel-quest-html5-game',
  'An engaging pixel-art platformer game built with Phaser.js. Includes 20 levels, power-ups, leaderboard, and mobile touch controls.',
  '["20 Unique Levels", "Mobile Touch Controls", "Leaderboard System", "Power-ups & Collectibles", "Sound Effects & Music", "Save Progress"]'::jsonb,
  29, NULL, 'html5-games',
  '["game", "html5", "phaser", "pixel-art"]'::jsonb,
  'https://images.unsplash.com/photo-1556438064-2d7646166914?w=600&h=400&fit=crop',
  '["https://images.unsplash.com/photo-1556438064-2d7646166914?w=800&h=600&fit=crop"]'::jsonb,
  'https://example.com/demo',
  456, 8920, 4.6
),
(
  'AutoBot Scripts Bundle',
  'autobot-scripts-bundle',
  'A collection of 15 powerful automation scripts for web scraping, data processing, and API integration. Python & Node.js.',
  '["15 Scripts", "Python & Node.js", "API Integration", "Data Processing", "Documentation", "Lifetime Updates"]'::jsonb,
  35, 55, 'scripts',
  '["scripts", "automation", "python", "nodejs"]'::jsonb,
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
  '["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop"]'::jsonb,
  NULL,
  334, 6780, 4.5
),
(
  'Portfolio Starter Template',
  'portfolio-starter-template',
  'A minimal and elegant portfolio template for designers and developers. Features smooth page transitions and CMS integration.',
  '["Minimal Design", "Page Transitions", "CMS Ready", "Blog Section", "Contact Form", "Fast Loading"]'::jsonb,
  25, NULL, 'templates',
  '["portfolio", "minimal", "developer", "designer"]'::jsonb,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
  '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop"]'::jsonb,
  'https://example.com/demo',
  567, 9870, 4.4
),
(
  'DevTools Suite',
  'devtools-suite',
  'Essential web development tools including CSS generators, color pickers, code formatters, and performance analyzers.',
  '["CSS Generators", "Color Palette Tools", "Code Formatter", "Performance Analyzer", "SEO Checker", "API Tester"]'::jsonb,
  45, 65, 'web-tools',
  '["tools", "developer", "css", "performance"]'::jsonb,
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop',
  '["https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop"]'::jsonb,
  'https://example.com/demo',
  289, 5430, 4.3
);
