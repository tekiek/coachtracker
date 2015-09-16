<?php

$table = 'events';
$table_cols = tableEventsCols();
$table_values = array();
$students = explode(";", $params['studentid']);

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
foreach($students as $studentid) {
	foreach($table_cols as $col => $structure) {
		if ($params[$col]) $table_values[$col] = $params[$col];
	}
	$table_values['studentid'] = $studentid;
	TableInsert($table, $table_values);
}


// Add data to table
$response = array(
	"success" => "true",
	"students" => $students,
	'tv' => $table_values
);

?>