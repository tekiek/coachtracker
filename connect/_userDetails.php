<?php
	require '../backend/common.php';
	$params = get_params();

	$user = TableRow('users', $params);
	
	echo json_encode($user);
?>