<?php
require '../common.php';

$params = get_params();
$table = 'events';
$col = 'signature';
$response = array(
	"success" => "false",
	"params" => $params
);

if ($params['id']) {
	$studentid = $params['id'];
	
	$sql = "SELECT $col FROM $table WHERE $col IS NOT NULL AND studentid = $studentid ORDER BY id DESC LIMIT 1";
	$events = queryTable($sql); 

	if ($events && $events[0] && $events[0]['signature']) {
		$response['success'] = 'true';
		$response['signature'] = $events[0]['signature'];
	}
}

echo json_encode($response);
?>