<?php
// ============================================
// RD Harmony Med Spa - Booking API Endpoint
// POST /api/book.php
// ============================================

require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/email.php';
require_once __DIR__ . '/includes/sms.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Parse input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid request body']);
    exit();
}

// Validate required fields
$required = ['name', 'email', 'phone', 'service', 'date', 'time'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => "Missing required field: {$field}"]);
        exit();
    }
}

// Sanitize inputs
$name = htmlspecialchars(strip_tags(trim($input['name'])));
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(strip_tags(trim($input['phone'])));
$service = htmlspecialchars(strip_tags(trim($input['service'])));
$serviceType = in_array($input['type'] ?? 'In-Clinic', ['In-Clinic', 'Mobile']) ? $input['type'] : 'In-Clinic';
$date = $input['date'];
$time = $input['time'];
$price = htmlspecialchars(strip_tags(trim($input['price'] ?? '')));
$notes = htmlspecialchars(strip_tags(trim($input['message'] ?? '')));

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid email address']);
    exit();
}

// Validate date format
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid date format']);
    exit();
}

try {
    $db = getDB();

    // Check for conflicting bookings (same date + time)
    $stmt = $db->prepare(
        "SELECT COUNT(*) FROM bookings WHERE appointment_date = ? AND appointment_time = ? AND status = 'confirmed'"
    );
    $stmt->execute([$date, $time]);
    if ($stmt->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode(['success' => false, 'message' => 'This time slot is already booked. Please choose a different time.']);
        exit();
    }

    // Insert booking
    $stmt = $db->prepare(
        "INSERT INTO bookings (name, email, phone, service, service_type, appointment_date, appointment_time, price, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([$name, $email, $phone, $service, $serviceType, $date, $time, $price, $notes]);
    $bookingId = $db->lastInsertId();

    // Prepare booking data for templates
    $booking = [
        'id' => $bookingId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'service' => $service,
        'service_type' => $serviceType,
        'appointment_date' => $date,
        'appointment_time' => $time,
        'price' => $price,
        'notes' => $notes
    ];

    // Send confirmation email
    $emailHtml = getConfirmationEmail($booking);
    $emailSent = sendEmail($email, 'Booking Confirmed - ' . BIZ_NAME, $emailHtml);

    // Log email
    $stmt = $db->prepare(
        "INSERT INTO email_log (booking_id, email_type, sent_to, status) VALUES (?, 'confirmation', ?, ?)"
    );
    $stmt->execute([$bookingId, $email, $emailSent ? 'sent' : 'failed']);

    // Send confirmation SMS
    $smsMessage = getConfirmationSMS($booking);
    $smsSent = sendSMS($phone, $smsMessage);

    if ($smsSent) {
        $stmt = $db->prepare(
            "INSERT INTO sms_log (booking_id, phone, message, status) VALUES (?, ?, ?, 'sent')"
        );
        $stmt->execute([$bookingId, $phone, $smsMessage]);
    }

    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Appointment booked successfully! Confirmation email has been sent.',
        'booking_id' => $bookingId,
        'email_sent' => $emailSent,
        'sms_sent' => $smsSent
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to save booking. Please try again.']);
}
