<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';
require 'PHPMailer/Exception.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $senderEmail = filter_var($data['email'] ?? '', FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars($data['message'] ?? '');
    
    if (empty($senderEmail) || empty($message)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Email and message are required']);
        exit;
    }
    
    if (!filter_var($senderEmail, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email format']);
        exit;
    }
    
    try {
        $mail = new PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.mail.ru';
        $mail->SMTPAuth = true;
        $mail->Username = 'pavel.klyuchuk@mail.ru';
        $mail->Password = 'YOUR_MAIL_RU_APP_PASSWORD'; // Нужно создать пароль приложения в настройках mail.ru
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;
        $mail->CharSet = 'UTF-8';
        
        // Recipients
        $mail->setFrom('pavel.klyuchuk@mail.ru', 'AI Summit Website');
        $mail->addAddress('pavel.klyuchuk@mail.ru');
        $mail->addReplyTo($senderEmail);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = 'New Message from AI Summit Website';
        $mail->Body = "
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { padding: 20px; }
                    .header { background: #f8f9fa; padding: 15px; border-radius: 5px; }
                    .message { margin-top: 20px; padding: 15px; background: #ffffff; border-left: 4px solid #007bff; }
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h2>New Message from AI Summit Website</h2>
                        <p><strong>From:</strong> {$senderEmail}</p>
                    </div>
                    <div class='message'>
                        <p><strong>Message:</strong></p>
                        <p>{$message}</p>
                    </div>
                </div>
            </body>
            </html>
        ";
        $mail->AltBody = "From: {$senderEmail}\n\nMessage:\n{$message}";
        
        $mail->send();
        
        // Save to file as backup
        $logEntry = date('Y-m-d H:i:s') . " - From: {$senderEmail}\nMessage: {$message}\n\n";
        file_put_contents('messages.log', $logEntry, FILE_APPEND);
        
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
    } catch (Exception $e) {
        error_log("Mailer Error: " . $mail->ErrorInfo);
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Failed to send message. Please try again later.']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}
?> 