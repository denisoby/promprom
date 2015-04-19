<?php

exit("Sorry, mail is disabled");

class app{
    public static function trigger_error($str){
        echo $str;
    }
}

$to = "victoria@aprilcom.ru";
//$to = "alenovikov@yandex.ru";
//$to = "denis.obydennykh@gmail.com";

$from = "robot@murmansksite.ru";
$subject = "Регистрация на мероприятие Promprom";
$smtp_host = "smtp.gmail.com";
$smtp_port = "465";
$smtp_login = "robot@murmansksite.ru";
$smtp_pwd = "YEAH!MAIL)";

$body =
    "Имя: ".$_POST['surname']." ".$_POST["name"]."\n".
    "E-mail: ".$_POST["email"]."\n".
    "Телефон: ".$_POST["phone"]."\n".
    "Вид деятельности: ".$_POST["org_vid_deyat"]."\n".
    "Список участников: ".$_POST["org_spisok_uchastnikov"]."\n".
    "IP: ".$_SERVER["REMOTE_ADDR"];

$result = false;
require_once('phpmailer/class.phpmailer.php');
$mail = new PHPMailer();
$mail->IsSMTP();
$mail->CharSet = 'UTF-8';
//$mail->SMTPDebug  = 1;                     // enables SMTP debug information (for testing)
$mail->SMTPAuth   = true;                  // enable SMTP authentication
$mail->SMTPSecure = "ssl";                 // sets the prefix to the servier
$mail->Host       = $smtp_host;      // sets GMAIL as the SMTP server
$mail->Port       = $smtp_port;                   // set the SMTP port for the GMAIL server
$mail->Username   = $smtp_login;  // GMAIL username
$mail->Password   = $smtp_pwd;            // GMAIL password
//$mail->AddReplyTo('name@yourdomain.com', 'First Last');
$mail->SetFrom($from);
if (is_array($to))
foreach ($to as $addr)
$mail->AddAddress($addr);
else $mail->AddAddress($to);
//$mail->AddReplyTo('name@yourdomain.com', 'First Last');
$mail->Subject = $subject;
//$mail->AltBody = 'To view the message, please use an HTML compatible email viewer!'; // optional - MsgHTML will create an alternate automatically
$mail->Body = $body;
//$mail->MsgHTML(file_get_contents('contents.html'));
//$mail->AddAttachment('images/phpmailer.gif');      // attachment
//$mail->AddAttachment('images/phpmailer_mini.gif'); // attachment
//$mail->Send();
if(!$mail->Send())
app::trigger_error("Mailer Error: " . $mail->ErrorInfo);
else
$result = true;

echo $result;
?>