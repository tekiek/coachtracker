<?php

require '../backend/common.php';
$params = get_params();

$response = array(
	"status" => "0",
	"params" => $params
);


if ($params['id'] && $params['type']) {
	$id = $params['id'];
	$table = ($params['type'] == 'student' ? 'students' : 'users');
	
	// Delete Row
	$ANDs = array();
	array_push($ANDs, array(
		'id' => $id
	));
	
	if (TableDelete($table, $ANDs)) {
		$response['status'] = 1;
	}
}

echo json_encode($response);

?>