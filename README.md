# Nexora — Premium Digital Marketplace

A production-ready SaaS marketplace platform for selling digital assets: websites, landing pages, dashboards, templates, scripts, HTML5 games, UI kits, and web tools.

## Tech Stack

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS v4, Framer Motion
- **Backend**: Supabase (Auth, Database, Storage, Realtime)
- **Database**: PostgreSQL
- **State**: Zustand
- **i18n**: i18next (Arabic + English, RTL/LTR)
- **Icons**: Lucide React
- **Hosting**: Vercel

## Features

- ✅ Premium SaaS design with glassmorphism & animations
- ✅ Full authentication (Email, Google, GitHub)
- ✅ Product catalog with search, filters, categories
- ✅ Live product preview (ThemeForest-style iframe)
- ✅ Checkout with PayPal & Vodafone Cash
- ✅ Order management with admin approval workflow
- ✅ Secure download system with expiring links
- ✅ Wishlist system
- ✅ Reviews & ratings
- ✅ Real-time notifications
- ✅ Full admin dashboard (analytics, products, orders, users, settings)
- ✅ Dark/Light mode with system detection
- ✅ Arabic/English with RTL support
- ✅ SEO optimized (sitemap, robots.txt, Open Graph, Schema)
- ✅ Row Level Security (RLS) on all tables
- ✅ Protected routes (auth + admin middleware)
- ✅ Responsive & mobile-first

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Nexora1
npm install
```

### 2. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
VODAFONE_CASH_NUMBER=your_vodafone_number
```

### 3. Setup Supabase Database

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Open your project → **SQL Editor**
3. Run `supabase/schema.sql` — Creates all tables, indexes, RLS policies, triggers, and seed data
4. Run `supabase/storage.sql` — Creates storage buckets and policies

### 4. Configure Supabase Auth

In Supabase Dashboard → **Authentication** → **Providers**:

- **Email**: Enable email confirmations
- **Google**: Add Google OAuth credentials
- **GitHub**: Add GitHub OAuth credentials

Set **Site URL** to your domain (e.g., `http://localhost:3000`)

Add **Redirect URLs**:
```
http://localhost:3000/auth/callback
https://your-domain.vercel.app/auth/callback
```

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

### 6. Make Yourself Admin

Run in Supabase SQL Editor:
```sql
UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';
```

Then visit `/admin` for the admin dashboard.

---

## Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/nexora.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [Vercel](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` → your Vercel domain
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `VODAFONE_CASH_NUMBER`
4. Deploy!

### 3. Update Supabase Auth URLs

In Supabase Dashboard → **Authentication** → **URL Configuration**:
- Set **Site URL** to `https://your-app.vercel.app`
- Add redirect URL: `https://your-app.vercel.app/auth/callback`

---

## PayPal Setup

1. Go to [PayPal Developer](https://developer.paypal.com/)
2. Create an App → Get **Client ID** and **Secret**
3. Add to `.env.local`:
   ```
   PAYPAL_CLIENT_ID=your_client_id
   PAYPAL_CLIENT_SECRET=your_secret
   ```

## Vodafone Cash Setup

1. Set your Vodafone Cash number in admin settings or `.env.local`
2. Customers send payment to your number
3. Enter the transaction ID when ordering
4. Admin verifies and approves in the dashboard

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin dashboard (layout + pages)
│   ├── api/                # API routes (orders, products, reviews, etc.)
│   ├── auth/               # Auth pages (login, register, forgot-password)
│   ├── checkout/           # Checkout flow
│   ├── products/           # Products listing & detail
│   ├── preview/            # Live product preview (iframe)
│   ├── dashboard/          # User dashboard
│   ├── contact/            # Contact page
│   ├── privacy/            # Privacy policy
│   ├── terms/              # Terms & conditions
│   ├── wishlist/           # User wishlist
│   ├── purchases/          # User purchases
│   ├── profile/            # User profile
│   └── notifications/      # User notifications
├── components/
│   ├── home/               # Homepage sections
│   ├── layout/             # Navbar, Footer, ClientLayout
│   ├── providers/          # ThemeProvider, I18nProvider, AuthProvider
│   └── ui/                 # ProductCard, shared components
├── i18n/                   # Translations (en.ts, ar.ts)
├── lib/
│   ├── supabase/           # Supabase clients (client, server, middleware)
│   └── demo-data.ts        # Demo products & testimonials
├── store/                  # Zustand stores
├── types/                  # TypeScript types
└── middleware.ts            # Auth middleware
supabase/
├── schema.sql              # Database schema + RLS + seed data
├── storage.sql             # Storage buckets + policies
└── make-admin.sql          # Admin promotion script
```

---

## Security

- ✅ Supabase Row Level Security (RLS) on all tables
- ✅ JWT-based authentication via Supabase Auth
- ✅ Protected admin routes (middleware checks role)
- ✅ Protected user routes (middleware checks session)
- ✅ Secure download links (signed URLs with expiry)
- ✅ Input validation on all API routes
- ✅ CSRF protection (built into Next.js)
- ✅ XSS protection (React auto-escaping)
- ✅ SQL injection protection (Supabase parameterized queries)
- ✅ Sandboxed iframe for live previews
- ✅ File upload validation

## License

All rights reserved. Commercial product.
