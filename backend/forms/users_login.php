<?php
require '../common.php';

$table = 'users';
$params = get_params();

$response = array(
	"success" => "false",
	"status" => "0"
);

if ($params['email'] && $params['password']) {
	$user_creds = array(
		'email' => $params['email'],
		'password' => $params['password']
	);
	
	// Find user
	if (TableCount($table, $user_creds) > 0) {

		// Get user info
		$user = TableRow($table, $user_creds);
		session_start();
		$_SESSION["loggedin-user"] = $user;
		$_SESSION["test"] = "1";

		// Get connections
		$user['students'] = getConnections('student', $user['id']);
		$user['users'] = getConnections('user', $user['id']);

		// Add data
		$response = array(
			"success" => "true",
			"status" => "1",
			"user" => $user
		);
	}
}

echo json_encode($response);
?>