-- ============================================
-- NEXORA: إدارة الأدمن
-- ============================================

-- ✅ إضافة أدمن واحد
UPDATE public.users SET role = 'admin' WHERE email = 'your-email@example.com';

-- ✅ إضافة أكتر من أدمن مرة واحدة
UPDATE public.users SET role = 'admin'
WHERE email IN (
  'admin1@example.com',
  'admin2@example.com',
  'admin3@example.com'
);

-- ✅ إزالة أدمن (رجوعه يوزر عادي)
-- UPDATE public.users SET role = 'user' WHERE email = 'admin2@example.com';

-- ✅ عرض كل الأدمنز
SELECT id, username, email, role, created_at FROM public.users WHERE role = 'admin';

-- ✅ عرض كل اليوزرز مع الرول
SELECT id, username, email, role, created_at FROM public.users ORDER BY role DESC, created_at ASC;
