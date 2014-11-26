<?php
require '../common.php';

$table = 'schedule';
$user = array();

$table_data = TableData($table, array("userid" => '2'));

while ($row = mysql_fetch_assoc($table_data)) {
	foreach($row as $column => $value) {
		$user[$column] = $value;
	}
}
print_r($user);


// $params = array();
// foreach($_GET as $name => $value) {
// 	$params[$name] = $value;
// }
// print_r ($params);
// 
// $to = "tekiek@gmail.com";
// $subject = "JerkFace Schedule Alert!";
// $body = "This is just a test email";
// $from = "no-reply@jerkface.com";
// 
// $header = "FROM: " . $from . "\r\n";
// $header .= "Reply-To: " . $from . "\r\n";
// $header .= "MIME-Version: 1.0\r\n";
// $header .= "Content-Type: text/html; charset=ISO-8859-1\r\n";
// 
// 
// SendMail($to, $subject, $body, $header);
// echo "Mail Sent!";
?>