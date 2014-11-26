<?php

require '../backend/common.php';
$params = get_params();

if ($params['user'] && $params['type']) {
	$user = $params['user'];
	$match = array("id" => $user['id']);
	$table = ($params['type'] == 'student' ? 'students' : 'users');
	
	// Update Table
	TableUpdate($table, $match, $user);
	
	// Return Row Data
	$row = TableRow($table, $match);
}

echo json_encode($row);

?>