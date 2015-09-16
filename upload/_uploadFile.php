<?php

/*
	Params:
	- myfile (file)
	- extension (string)
	- table (string)
*/

require '_config.php';
$params = get_params();

$response = array(
	"success" => "false",
	"params" => $params,
	"error" => "Server Error!"
);

if ($_FILES['myfile']) {
	
	// Copy file to server
	$file_name = date("Y-m-d-h:i") . "." . $params['extension'];
	$copy_response = copy_file($_FILES['myfile'], data_dir(), $file_name);
	

	if ($copy_response['status'] == '1') {
		// Get file data
		$file_path = data_dir() . $copy_response['file'];
		$file_data = get_file_data($file_path);
		$table_cols = uploadTableCols($params['table']);
		$file_valid = validateFile($file_path, $params['table']);
		
		// Check if file headers match table cols
		if (count(array_diff($file_data['header'], $table_cols)) > 0) {
			$response['diff'] = array_diff($file_data['header'], $table_cols);
			$response['error'] = "Table columns do not match!";
		} 
		else if (!$file_valid) {
			$response['error'] = "File Will Not Upload!";
			$response['test'] = $file_valid;
		}
		else {
			$response['success'] = "true";
			$response['columns'] = $table_cols;
			$response['data'] = $file_data['data'];
			$response['file'] = data_dir() . $copy_response['file'];
			$response['test'] = $file_valid;
		}
	} else {
		$response['error'] = "Unable to copy file!";
	}
}

echo json_encode($response);
?>