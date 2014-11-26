<?php
require '_config.php';
$params = get_params();

$response = array(
	"success" => "false",
	"params" => $params
);

// Add Image
if ($_FILES['myfile']) {
	$file_name = date("Y-m-d-h:i") . "." . $params['extension'];
	$copy_response = copy_file($_FILES['myfile'], data_dir(), $file_name);
	
	if ($copy_response['status'] == '1') {
		$file_data = get_file_data(data_dir() . $copy_response['image']);
		$response['success'] = "true";
		$response['columns'] = $file_data['header'];
		$response['data'] = $file_data['data'];
		$response['file'] = data_dir() . $copy_response['image'];
	}
}

echo json_encode($response);
?>