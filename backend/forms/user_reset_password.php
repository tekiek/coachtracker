<?php

$table = 'users';
$rando_string = md5(uniqid(rand(), true));
$password = substr($rando_string, 0, 5);

if ($params['email']) {
	$user = array(
		'email' => $params["email"]
	);
	
	$update = array(
		'password' => $password,
		'pwReset' => 0
	);
	
	if (TableCount($table, $user) > 0) {
		if (TableUpdate($table, $user, $update)) {
			SendMail($params["email"], 'Password Reset', 'New Password: ' . $password);
			$response = array(
				"success" => "true"
			);
		}
	}
}

?>