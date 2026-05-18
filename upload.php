<?php
// السماح بالطلبات من أي مكان (لتتمكن من الرفع من موقعك على Vercel)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// الاستجابة لطلبات OPTIONS (Preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// المجلد الذي سيتم حفظ الصور فيه (وهو المجلد الحالي)
$uploadDir = __DIR__ . '/';
$uploadedFiles = [];

// استخراج الدومين الخاص بك تلقائياً
$baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/';

if (!empty($_FILES['images'])) {
    foreach ($_FILES['images']['tmp_name'] as $key => $tmpName) {
        if ($_FILES['images']['error'][$key] === UPLOAD_ERR_OK) {
            // تنظيف اسم الملف لتجنب أي مشاكل
            $originalName = basename($_FILES['images']['name'][$key]);
            $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.]/", "_", $originalName);
            $destination = $uploadDir . $fileName;

            // نقل الملف المرفوع إلى المجلد
            if (move_uploaded_file($tmpName, $destination)) {
                $uploadedFiles[] = $baseUrl . $fileName;
            }
        }
    }
}

if (!empty($uploadedFiles)) {
    echo json_encode(['success' => true, 'urls' => $uploadedFiles]);
} else {
    echo json_encode(['success' => false, 'error' => 'No files uploaded or upload failed']);
}
?>
