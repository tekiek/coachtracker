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
		
		// Save user to session data
		userLoggedIn($user);

		// Get student connections
		//$user['students'] = getConnectedStudentsOfUsers($user['id']);
		//$user['students'] = getConnectedStudentsOfLoggedinUser()['data'];

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