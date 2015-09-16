<?php

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

	$response = array(
		"success" => "true",
		'to' => $to,
		'subject' => $subject,
		'body' => $body
	);
}

?>