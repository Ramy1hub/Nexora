import { NextResponse } from "next/server";

export async function GET() {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /dashboard/
Disallow: /api/
Disallow: /auth/
Disallow: /preview/

Sitemap: https://nexora.vercel.app/sitemap.xml`;

  return new NextResponse(robots, {
    headers: { "Content-Type": "text/plain" },
  });
}
