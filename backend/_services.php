<?php
require 'common.php';

$params = get_params();
$response = array(
	"success" => "false",
);
$services = array(
	'userLogin' 				=> 'forms/user_login.php',
	'userLogout'				=> 'forms/user_logout.php',
	'pwUpdate' 					=> 'forms/user_update_password.php',
	'resetPassword' 			=> 'forms/user_reset_password.php',
	'eventAdd' 					=> 'forms/event_add.php',
	'eventFollowupConnections' 	=> 'forms/event_followup_connections.php',
	'eventFollowup' 			=> 'forms/event_followup.php',
	'helpEmail' 				=> 'forms/help_email.php',
	'connectedStudents' 		=> 'forms/connected_students.php',
	'studentEdit' 				=> 'forms/student_field_update.php',
);

if ($params['service'] && $services[$params['service']]) {
	require $services[$params['service']];
}

$response['params'] = $params;
echo json_encode($response);
?>