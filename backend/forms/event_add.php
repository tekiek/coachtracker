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

// Create table data array
foreach($table_cols as $col => $structure) {
	if ($params[$col]) $table_values[$col] = $params[$col];
}

// Add data to table
if (TableInsert($table, $table_values)) {
	$response = array(
		"success" => "true",
		"status" => "1"
	);
} else {
	$response = array(
		"success" => "false",
		"status" => "0"
	);
}

echo json_encode($response);
?>