<?php
require '../common.php';

$table = 'students';
$params = get_params();

$response = array(
	"success" => "false",
	"params" => $params
);

// Add Image
if ($_FILES['myfile']) {
	$file_name = $params["id"] . "." . $params['extension'];
	$image_response = copy_file($_FILES['myfile'], students_image_dir(), $file_name);

	if ($image_response['status'] == '1') {
		$params["field"] = 'userImg';
		$params["value"] = $file_name;
	}
}

// Update field
$result = TableUpdate($table, array("id" => $params["id"]), array($params["field"] => $params["value"]));
if ($result) {
	$response["success"] = "true";
	$response["value"] = $params["value"];
	$response["field"] = $params["field"];
}

echo json_encode($response);
?>