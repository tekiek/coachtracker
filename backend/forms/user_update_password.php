<?php
$table = 'users';

if ($params['id'] && $params['password']) {
	$user = array(
		'id' => $params["id"]
	);
	
	$update = array(
		'password' => $params["password"],
		'pwReset' => 1
	);

	if (TableUpdate($table, $user, $update)) {
		$response = array(
			"success" => "true"
		);
	}
}

?>