<?php
require '../common.php';

$table = 'events';
$table_cols = tableEventsCols();
$params = get_params();
$table_values = array();

// Create array out of params
foreach($_POST as $name => $value) {
	$params[$name] = $value;
}

// Validate date
$jsDateTS = strtotime($params['timestamp']);
if ($jsDateTS !== false) {
	$params['timestamp'] =  date('Y-m-d', $jsDateTS);
} else {
	$params['timestamp'] = date('Y-m-d', time());
}


// Create table data array
foreach($table_cols as $col => $structure) {
	if ($params[$col]) $table_values[$col] = $params[$col];
}

// Add data to table
if (TableInsert($table, $table_values)) {
	$response = array(
		"success" => "true",
		"status" => "1",
		"params" => $params
	);
} else {
	$response = array(
		"success" => "false",
		"status" => "0",
		"params" => $params
	);
}

echo json_encode($response);
?>