<?php

require '_config.php';
$params = get_params();
$table = 'events';
$response = array(
	"status" => "0",
	"params" => $params
);


if ($params['id']) {
	$id = $params['id'];
	
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