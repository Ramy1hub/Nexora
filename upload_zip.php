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

// المجلد الذي سيتم حفظ الملفات فيه (الافتراضي هو نفس مجلد الـ imag)
$uploadDir = __DIR__ . '/';

// استخراج الدومين الخاص بك
$baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/';

if (!empty($_FILES['zip_file']) && $_FILES['zip_file']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['zip_file']['tmp_name'];
    $originalName = basename($_FILES['zip_file']['name']);
    
    // السماح بملفات zip و rar فقط لمزيد من الحماية
    $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    if (in_array($ext, ['zip', 'rar'])) {
        // تنظيف اسم الملف
        $fileName = time() . '_' . preg_replace("/[^a-zA-Z0-9.-]/", "_", $originalName);
        $destination = $uploadDir . $fileName;

        // نقل الملف المرفوع إلى المجلد
        if (move_uploaded_file($tmpName, $destination)) {
            echo json_encode(['success' => true, 'url' => $baseUrl . $fileName]);
            exit;
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Only ZIP or RAR files are allowed']);
        exit;
    }
}

echo json_encode(['success' => false, 'error' => 'No valid zip file uploaded']);
?>
