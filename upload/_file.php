<?php
require '_config.php';
$params = get_params();

$response = array(
	"success" => "false",
	"params" => $params,
	"error" => "Server Error!"
);

// Add Image
if ($_FILES['myfile']) {
	$file_name = date("Y-m-d-h:i") . "." . $params['extension'];
	$copy_response = copy_file($_FILES['myfile'], data_dir(), $file_name);
	
	// Check if file was saved
	if ($copy_response['status'] == '1') {
		$file_data = get_file_data(data_dir() . $copy_response['image']);
		$table_cols = uploadTableCols($params['table']);
		
		// Check if file headers match table cols
		if (count(array_diff($file_data['header'], $table_cols)) > 0) {
			$response['diff'] = array_diff($file_data['header'], $table_cols);
			$response['error'] = "Table columns do not match!";
		} else {
			$response['success'] = "true";
			$response['columns'] = $table_cols;
			$response['data'] = $file_data['data'];
			$response['file'] = data_dir() . $copy_response['image'];
		}
	} else {
		$response['error'] = "Unable to copy file!";
	}
}

echo json_encode($response);
?>