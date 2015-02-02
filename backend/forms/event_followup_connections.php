<?php
require '../common.php';

$params = get_params();
$cols = array('id','name','email', 'admin', 'captain');
$users = array();

if ($params['id']) {
	
	// Get connected users to student
	$connectedUsers = getConnectedUsersOfStudents($params['id'], $cols);
	
	// Remove
	foreach($connectedUsers as $connectedUser) {
		if ($connectedUser['admin'] == '1' || $connectedUser['captain'] == '1' || $connectedUser['admin'] == 1 || $connectedUser['captain'] == 1) {
			continue;
		} else {
			array_push($users, $connectedUser);
		}
	}
}

$response = array(
	"users" => $users
);

echo json_encode($response);
?>