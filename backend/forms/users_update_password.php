<?php
require '../common.php';

$table = 'users';
$params = get_params();

$response = array(
	"success" => "false",
	"params" => $params
);

if ($params['id'] && $params['password']) {
	$user = array(
		'id' => $params["id"]
	);
	
	$update = array(
		'password' => $params["password"],
		'pwReset' => 1
	);
	
	$result = TableUpdate($table, $user, $update);
	if ($result) {
		$response['success'] = "true";
	}
}

echo json_encode($response);
?>