import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const type = req.headers.get("x-upload-type") || "image";
    
    // توجيه الطلب إلى سيرفرك الشخصي
    const targetUrl = type === "zip" 
      ? "https://dev-store1.zya.me/imag/upload_zip.php"
      : "https://dev-store1.zya.me/imag/upload.php";

    const response = await fetch(targetUrl, {
      method: "POST",
      body: formData,
      headers: {
        // تمويه السيرفر المجاني ليعتقد أن الطلب قادم من متصفح حقيقي لتجنب حظر البوتات
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
      }
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      // السيرفر المجاني قام بإرجاع صفحة HTML (حظر) بدلاً من JSON
      return NextResponse.json({ success: false, error: "استضافتك المجانية تمنع الاتصال برمجياً وتقوم بإرجاع صفحة حماية." }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
