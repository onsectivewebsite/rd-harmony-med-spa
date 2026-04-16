<?php
// ============================================
// RD Harmony Med Spa - Configuration
// ============================================
// UPDATE THESE VALUES FOR YOUR CPANEL SETUP

// Database Configuration (from cPanel > MySQL Databases)
define('DB_HOST', 'localhost');
define('DB_NAME', 'your_cpanel_user_rd_harmony');  // cPanel prefixes with username
define('DB_USER', 'your_cpanel_user_dbuser');       // cPanel prefixes with username
define('DB_PASS', 'your_database_password');

// Business Info
define('BIZ_NAME', 'RD Harmony Med Spa');
define('BIZ_EMAIL', 'rajudhanju1974@gmail.com');
define('BIZ_PHONE', '(647) 819-1892');
define('BIZ_ADDRESS', '78 Jones St, Oakville, ON L6L 6C5');
define('BIZ_HOURS', 'Mon-Sat: 9:00 AM - 7:00 PM');
define('BIZ_WEBSITE', 'https://rdharmonymedspa.com');  // UPDATE with your domain
define('BIZ_LOGO_URL', 'https://rdharmonymedspa.com/logo.png');  // UPDATE with your domain

// Email Configuration (SMTP)
// GoDaddy cPanel: use Workspace Email or external SMTP
define('SMTP_HOST', 'smtp.gmail.com');       // Or your GoDaddy SMTP host
define('SMTP_PORT', 587);
define('SMTP_USER', 'rajudhanju1974@gmail.com');  // Your email
define('SMTP_PASS', 'your_app_password_here');     // Gmail App Password or SMTP password
define('SMTP_FROM_NAME', 'RD Harmony Med Spa');
define('SMTP_FROM_EMAIL', 'rajudhanju1974@gmail.com');

// Twilio SMS Configuration (https://www.twilio.com/console)
define('TWILIO_SID', 'your_twilio_account_sid');
define('TWILIO_AUTH_TOKEN', 'your_twilio_auth_token');
define('TWILIO_FROM_NUMBER', '+1XXXXXXXXXX');  // Your Twilio phone number

// Timezone
date_default_timezone_set('America/Toronto');

// CORS for React frontend
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
