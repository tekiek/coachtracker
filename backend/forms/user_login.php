<?php

$table = 'users';

if ($params['email'] && $params['password']) {
	$user_creds = array(
		'email' => $params['email'],
		'password' => $params['password']
	);
	
	// Find user
	if (TableCount($table, $user_creds) > 0) {

		// Get user info
		$user = TableRow($table, $user_creds);
		
		// Save user to session data
		userLoggedIn($user);

		// Response
		$response = array(
			"success" => "true",
			"user" => $user
		);
	}
}

?>