<?php
require '../common.php';
$params = get_params();
$response = array();

if ($params['to'] && $params['msg']) {
	foreach($params['to'] as $user_id) {
		$user = TableRow('users', array(
			'id' => $user_id
		));
		
		if ($user['email']) {
			$to = $user['email'];
			$subject = $params['subject'];
			$body = "";
			if ($user['name']) $body .= "Hi " . $user['name'] . ",\n\n";
			$body .= $params['msg'];
			if ($params['from']) {
				$body .= "\n\n";
				if ($params['from']['name']) $body .= $params['from']['name'] . "\n";
				if ($params['from']['email']) $body .= $params['from']['email'];
			}
			SendMail($to, $subject, $body);
		}
		array_push($response, $user);
	}
}

echo json_encode($params);
?>