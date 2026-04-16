<?php
require_once __DIR__ . '/config.php';

function sendEmail($to, $subject, $htmlBody) {
    // Use PHP mail() with proper headers (works on cPanel out of the box)
    // For better deliverability, you can switch to PHPMailer with SMTP

    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . SMTP_FROM_NAME . " <" . SMTP_FROM_EMAIL . ">\r\n";
    $headers .= "Reply-To: " . SMTP_FROM_EMAIL . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $sent = @mail($to, $subject, $htmlBody, $headers);

    // Also send a copy to the business
    if ($sent && $to !== BIZ_EMAIL) {
        @mail(BIZ_EMAIL, "[Copy] " . $subject, $htmlBody, $headers);
    }

    return $sent;
}

function getConfirmationEmail($booking) {
    $date = date('l, F j, Y', strtotime($booking['appointment_date']));
    $time = date('g:i A', strtotime($booking['appointment_time']));

    return getEmailTemplate(
        'Booking Confirmed!',
        "Hi {$booking['name']},",
        "Thank you for booking with <strong>RD Harmony Med Spa</strong>. Your appointment has been confirmed. We look forward to seeing you!",
        [
            'Service' => $booking['service'],
            'Type' => $booking['service_type'],
            'Date' => $date,
            'Time' => $time,
            'Price' => $booking['price'] ?? 'To be confirmed'
        ],
        "If you need to reschedule or cancel, please call us at " . BIZ_PHONE . " at least 24 hours before your appointment.",
        '#8B5CF6',
        'Your Appointment Details'
    );
}

function getReminderEmail($booking, $reminderType) {
    $date = date('l, F j, Y', strtotime($booking['appointment_date']));
    $time = date('g:i A', strtotime($booking['appointment_time']));

    $titles = [
        '1month' => 'Appointment in 1 Month',
        '1week'  => 'Appointment in 1 Week',
        '5day'   => 'Appointment in 5 Days'
    ];

    $messages = [
        '1month' => "This is a friendly reminder that your appointment at <strong>RD Harmony Med Spa</strong> is coming up in <strong>1 month</strong>. Please mark your calendar!",
        '1week'  => "Your appointment at <strong>RD Harmony Med Spa</strong> is just <strong>1 week away</strong>! We're excited to see you soon.",
        '5day'   => "Your appointment at <strong>RD Harmony Med Spa</strong> is in <strong>5 days</strong>! Please make sure to arrive 5-10 minutes early."
    ];

    $colors = [
        '1month' => '#6366F1',
        '1week'  => '#F59E0B',
        '5day'   => '#EF4444'
    ];

    return getEmailTemplate(
        $titles[$reminderType] ?? 'Appointment Reminder',
        "Hi {$booking['name']},",
        $messages[$reminderType] ?? 'You have an upcoming appointment.',
        [
            'Service' => $booking['service'],
            'Date' => $date,
            'Time' => $time,
            'Location' => ($booking['service_type'] === 'Mobile') ? 'Mobile Service (We come to you)' : BIZ_ADDRESS
        ],
        "Need to reschedule? Call us at " . BIZ_PHONE . " or reply to this email.",
        $colors[$reminderType] ?? '#8B5CF6',
        'Appointment Reminder'
    );
}

function getEmailTemplate($heading, $greeting, $message, $details, $footer_note, $accentColor, $preheader) {
    $detailsHtml = '';
    foreach ($details as $label => $value) {
        $detailsHtml .= "
            <tr>
                <td style='padding: 12px 16px; border-bottom: 1px solid #f3f4f6; color: #6b7280; font-size: 14px; width: 140px;'>{$label}</td>
                <td style='padding: 12px 16px; border-bottom: 1px solid #f3f4f6; color: #1f2937; font-size: 14px; font-weight: 600;'>{$value}</td>
            </tr>";
    }

    $logoUrl = BIZ_LOGO_URL;
    $bizName = BIZ_NAME;
    $bizAddress = BIZ_ADDRESS;
    $bizPhone = BIZ_PHONE;
    $bizEmail = BIZ_EMAIL;
    $bizHours = BIZ_HOURS;
    $bizWebsite = BIZ_WEBSITE;
    $year = date('Y');

    return <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{$heading}</title>
    <!--[if mso]>
    <style>table,td,div,p{font-family:Arial,sans-serif!important;}</style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <!-- Preheader -->
    <div style="display: none; max-height: 0; overflow: hidden;">{$preheader}</div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

                    <!-- Logo Header -->
                    <tr>
                        <td align="center" style="padding-bottom: 32px;">
                            <table role="presentation" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-right: 12px; vertical-align: middle;">
                                        <img src="{$logoUrl}" alt="{$bizName}" width="50" height="50" style="display: block; border-radius: 12px;">
                                    </td>
                                    <td style="vertical-align: middle;">
                                        <span style="font-size: 22px; font-weight: 700; color: #1f2937; letter-spacing: -0.5px;">RD Harmony</span><br>
                                        <span style="font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 2px;">Med Spa</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Card -->
                    <tr>
                        <td>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); overflow: hidden;">

                                <!-- Accent Bar -->
                                <tr>
                                    <td style="height: 4px; background: linear-gradient(90deg, {$accentColor}, #EC4899);"></td>
                                </tr>

                                <!-- Heading -->
                                <tr>
                                    <td style="padding: 40px 40px 0 40px;">
                                        <h1 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 700; color: #1f2937;">{$heading}</h1>
                                    </td>
                                </tr>

                                <!-- Greeting & Message -->
                                <tr>
                                    <td style="padding: 16px 40px 0 40px;">
                                        <p style="margin: 0 0 16px 0; font-size: 16px; color: #374151; line-height: 1.6;">{$greeting}</p>
                                        <p style="margin: 0; font-size: 15px; color: #4b5563; line-height: 1.7;">{$message}</p>
                                    </td>
                                </tr>

                                <!-- Details Table -->
                                <tr>
                                    <td style="padding: 28px 40px;">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf5ff; border-radius: 12px; border: 1px solid #e9d5ff; overflow: hidden;">
                                            {$detailsHtml}
                                        </table>
                                    </td>
                                </tr>

                                <!-- CTA Button -->
                                <tr>
                                    <td align="center" style="padding: 0 40px 16px 40px;">
                                        <a href="{$bizWebsite}/booking" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, {$accentColor}, #EC4899); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 600; border-radius: 50px; letter-spacing: 0.3px;">Book Another Appointment</a>
                                    </td>
                                </tr>

                                <!-- Footer Note -->
                                <tr>
                                    <td style="padding: 8px 40px 36px 40px;">
                                        <p style="margin: 0; font-size: 13px; color: #9ca3af; line-height: 1.6; text-align: center;">{$footer_note}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 20px; text-align: center;">
                            <table role="presentation" cellpadding="0" cellspacing="0" align="center">
                                <tr>
                                    <td style="padding-bottom: 16px;">
                                        <img src="{$logoUrl}" alt="{$bizName}" width="36" height="36" style="display: block; margin: 0 auto; border-radius: 8px; opacity: 0.7;">
                                    </td>
                                </tr>
                            </table>
                            <p style="margin: 0 0 4px 0; font-size: 13px; color: #6b7280; font-weight: 600;">{$bizName}</p>
                            <p style="margin: 0 0 4px 0; font-size: 12px; color: #9ca3af;">{$bizAddress}</p>
                            <p style="margin: 0 0 4px 0; font-size: 12px; color: #9ca3af;">{$bizPhone} &bull; {$bizEmail}</p>
                            <p style="margin: 0 0 12px 0; font-size: 12px; color: #9ca3af;">{$bizHours}</p>
                            <p style="margin: 0; font-size: 11px; color: #d1d5db;">&copy; {$year} {$bizName}. All rights reserved.</p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
HTML;
}
