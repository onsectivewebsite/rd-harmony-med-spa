<?php
require_once __DIR__ . '/config.php';

function sendSMS($to, $message) {
    if (TWILIO_SID === 'your_twilio_account_sid') {
        return false; // Twilio not configured
    }

    // Format phone number (ensure +1 prefix for North America)
    $to = preg_replace('/[^0-9+]/', '', $to);
    if (strlen($to) === 10) {
        $to = '+1' . $to;
    } elseif (strlen($to) === 11 && $to[0] === '1') {
        $to = '+' . $to;
    }

    $url = 'https://api.twilio.com/2010-04-01/Accounts/' . TWILIO_SID . '/Messages.json';

    $data = [
        'From' => TWILIO_FROM_NUMBER,
        'To'   => $to,
        'Body' => $message
    ];

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => http_build_query($data),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_USERPWD        => TWILIO_SID . ':' . TWILIO_AUTH_TOKEN,
        CURLOPT_TIMEOUT        => 30
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    return $httpCode >= 200 && $httpCode < 300;
}

function getConfirmationSMS($booking) {
    $date = date('M j, Y', strtotime($booking['appointment_date']));
    $time = date('g:i A', strtotime($booking['appointment_time']));

    return BIZ_NAME . ": Hi {$booking['name']}! Your appointment is confirmed.\n\n"
         . "Service: {$booking['service']}\n"
         . "Date: {$date}\n"
         . "Time: {$time}\n\n"
         . "Location: " . BIZ_ADDRESS . "\n"
         . "Questions? Call " . BIZ_PHONE;
}

function getReminderSMS($booking, $reminderType) {
    $date = date('M j, Y', strtotime($booking['appointment_date']));
    $time = date('g:i A', strtotime($booking['appointment_time']));

    $timeframes = [
        '1month' => 'in 1 month',
        '1week'  => 'in 1 week',
        '5day'   => 'in 5 days'
    ];

    $timeframe = $timeframes[$reminderType] ?? 'soon';

    return BIZ_NAME . ": Reminder - your {$booking['service']} appointment is {$timeframe}!\n\n"
         . "Date: {$date} at {$time}\n"
         . "Location: " . BIZ_ADDRESS . "\n\n"
         . "Need to reschedule? Call " . BIZ_PHONE;
}
