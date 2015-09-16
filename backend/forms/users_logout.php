<?php
	require '../common.php';
	
	userLogout();

	$response = array(
		"success" => "true",
		"status" => "1"
	);
	echo json_encode($response);
?>