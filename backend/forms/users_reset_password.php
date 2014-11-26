<?php
require '../common.php';

$table = 'users';
$params = get_params();
$rando_string = md5(uniqid(rand(), true));
$password = substr($rando_string, 0, 5);

$response = array(
	"success" => "false",
	"params" => $params
);

if ($params['email']) {
	$user = array(
		'email' => $params["email"]
	);
	
	$update = array(
		'password' => $password,
		'pwReset' => 0
	);
	
	if (TableCount($table, $user) > 0) {
		$result = TableUpdate($table, $user, $update);
		if ($result) {
			$response["success"] = "true";
			SendMail($params["email"], 'Password Reset', 'New Password: ' . $password);
		}
	}
}

echo json_encode($response);

?>