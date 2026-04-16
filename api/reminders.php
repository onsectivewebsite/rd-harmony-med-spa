<?php
// ============================================
// RD Harmony Med Spa - Automated Reminder Cron Job
// ============================================
// Set up in cPanel > Cron Jobs:
// Run every day at 9:00 AM:
//   /usr/local/bin/php /home/YOUR_USER/public_html/api/reminders.php
// ============================================

// Prevent web access - only allow CLI
if (php_sapi_name() !== 'cli' && !isset($_GET['cron_key'])) {
    // Allow access with a secret key for testing via browser
    http_response_code(403);
    echo json_encode(['error' => 'Access denied. CLI or cron_key required.']);
    exit();
}

require_once __DIR__ . '/includes/db.php';
require_once __DIR__ . '/includes/email.php';
require_once __DIR__ . '/includes/sms.php';

$db = getDB();
$today = date('Y-m-d');
$sent = ['emails' => 0, 'sms' => 0];
$errors = [];

// ---- 1 MONTH REMINDER (30 days before) ----
$targetDate1Month = date('Y-m-d', strtotime('+30 days'));
$stmt = $db->prepare(
    "SELECT * FROM bookings
     WHERE appointment_date = ?
     AND status = 'confirmed'
     AND reminder_1month_sent = 0"
);
$stmt->execute([$targetDate1Month]);
$bookings1Month = $stmt->fetchAll();

foreach ($bookings1Month as $booking) {
    // Send email
    $emailHtml = getReminderEmail($booking, '1month');
    $emailSent = sendEmail($booking['email'], 'Appointment Reminder (1 Month) - ' . BIZ_NAME, $emailHtml);

    if ($emailSent) {
        $sent['emails']++;
        $db->prepare("UPDATE bookings SET reminder_1month_sent = 1 WHERE id = ?")->execute([$booking['id']]);
        $db->prepare("INSERT INTO email_log (booking_id, email_type, sent_to, status) VALUES (?, 'reminder_1month', ?, 'sent')")
           ->execute([$booking['id'], $booking['email']]);
    } else {
        $errors[] = "Failed email 1month reminder for booking #{$booking['id']}";
    }

    // Send SMS
    $smsMessage = getReminderSMS($booking, '1month');
    $smsSent = sendSMS($booking['phone'], $smsMessage);
    if ($smsSent) {
        $sent['sms']++;
        $db->prepare("INSERT INTO sms_log (booking_id, phone, message, status) VALUES (?, ?, ?, 'sent')")
           ->execute([$booking['id'], $booking['phone'], $smsMessage]);
    }
}

// ---- 1 WEEK REMINDER (7 days before) ----
$targetDate1Week = date('Y-m-d', strtotime('+7 days'));
$stmt = $db->prepare(
    "SELECT * FROM bookings
     WHERE appointment_date = ?
     AND status = 'confirmed'
     AND reminder_1week_sent = 0"
);
$stmt->execute([$targetDate1Week]);
$bookings1Week = $stmt->fetchAll();

foreach ($bookings1Week as $booking) {
    $emailHtml = getReminderEmail($booking, '1week');
    $emailSent = sendEmail($booking['email'], 'Appointment Reminder (1 Week) - ' . BIZ_NAME, $emailHtml);

    if ($emailSent) {
        $sent['emails']++;
        $db->prepare("UPDATE bookings SET reminder_1week_sent = 1 WHERE id = ?")->execute([$booking['id']]);
        $db->prepare("INSERT INTO email_log (booking_id, email_type, sent_to, status) VALUES (?, 'reminder_1week', ?, 'sent')")
           ->execute([$booking['id'], $booking['email']]);
    } else {
        $errors[] = "Failed email 1week reminder for booking #{$booking['id']}";
    }

    $smsMessage = getReminderSMS($booking, '1week');
    $smsSent = sendSMS($booking['phone'], $smsMessage);
    if ($smsSent) {
        $sent['sms']++;
        $db->prepare("INSERT INTO sms_log (booking_id, phone, message, status) VALUES (?, ?, ?, 'sent')")
           ->execute([$booking['id'], $booking['phone'], $smsMessage]);
    }
}

// ---- 5 DAY REMINDER ----
$targetDate5Day = date('Y-m-d', strtotime('+5 days'));
$stmt = $db->prepare(
    "SELECT * FROM bookings
     WHERE appointment_date = ?
     AND status = 'confirmed'
     AND reminder_5day_sent = 0"
);
$stmt->execute([$targetDate5Day]);
$bookings5Day = $stmt->fetchAll();

foreach ($bookings5Day as $booking) {
    $emailHtml = getReminderEmail($booking, '5day');
    $emailSent = sendEmail($booking['email'], 'Appointment Reminder (5 Days) - ' . BIZ_NAME, $emailHtml);

    if ($emailSent) {
        $sent['emails']++;
        $db->prepare("UPDATE bookings SET reminder_5day_sent = 1 WHERE id = ?")->execute([$booking['id']]);
        $db->prepare("INSERT INTO email_log (booking_id, email_type, sent_to, status) VALUES (?, 'reminder_5day', ?, 'sent')")
           ->execute([$booking['id'], $booking['email']]);
    } else {
        $errors[] = "Failed email 5day reminder for booking #{$booking['id']}";
    }

    $smsMessage = getReminderSMS($booking, '5day');
    $smsSent = sendSMS($booking['phone'], $smsMessage);
    if ($smsSent) {
        $sent['sms']++;
        $db->prepare("INSERT INTO sms_log (booking_id, phone, message, status) VALUES (?, ?, ?, 'sent')")
           ->execute([$booking['id'], $booking['phone'], $smsMessage]);
    }
}

// Output summary
$summary = [
    'date' => $today,
    'time' => date('H:i:s'),
    'reminders_checked' => [
        '1month' => count($bookings1Month),
        '1week'  => count($bookings1Week),
        '5day'   => count($bookings5Day)
    ],
    'sent' => $sent,
    'errors' => $errors
];

echo json_encode($summary, JSON_PRETTY_PRINT) . "\n";

// Log to file for cPanel debugging
$logFile = __DIR__ . '/reminder_log.txt';
file_put_contents($logFile, date('Y-m-d H:i:s') . ' - ' . json_encode($summary) . "\n", FILE_APPEND);
