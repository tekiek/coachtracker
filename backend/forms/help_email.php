<?php
require '../common.php';
$params = get_params();
$response = array();

$to = 'tekiek@gmail.com,maggieb@cypresshills.org';
$subject = 'Coach Track: Help Request!';
$body = '';

if ($params['msg']) {
	$body = $params['msg'];
	if ($params['from']) {
		$body .= "\n\n";
		if ($params['from']['name']) $body .= $params['from']['name'] . "\n";
		if ($params['from']['email']) $body .= $params['from']['email'];
	}
	SendMail($to, $subject, $body);
}

$response = array(
	'params' => $params,
	'to' => $to,
	'subject' => $subject,
	'body' => $body
);

echo json_encode($response);
?>