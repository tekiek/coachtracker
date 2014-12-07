<?php

require '_config.php';
$params = get_params();

$response = array(
	"success" => "false",
	"params" => $params,
	"msg" => "Server Error!"
);

$table = $params['table'];
$file_path = $params['file'];
$file_data = get_file_data($file_path);
$file_rows = $file_data['data'];
$table_cols = $file_data['header'];
$success_upload = array(); 
$failed_upload = array();
$successCount = 0;

// Add data to table
foreach($file_rows as $row) {
	$index = 0; $table_values = array();

	// Turn into array
	foreach($table_cols as $col) {
		if ($row[$index]) {
			$table_values[$col] = $row[$index];
		} else {
			$table_values[$col] = NULL;
		}
		$index++;
	}

	// Add to database
	if (TableInsert($table, $table_values)) {
		//array_push($success_upload, $table_values);
		$successCount += 1;
	} else {
		//array_push($failed_upload, $table_values);
	}
}

if ($successCount > 0) {
	$response['success'] = "true";
	$response['msg'] = $successCount . " of " . count($file_rows) . " inserted!";
}


echo json_encode($response);
?>