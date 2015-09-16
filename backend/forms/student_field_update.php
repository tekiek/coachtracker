<?php
$table = 'students';

// Add Image
// if ($_FILES['myfile']) {
// 	
// 	// Copy Image
// 	$file_name = $params["id"] . ".png";
// 	$file_path = root_dir() . '/images/students/';
// 	$image_response = copy_file($_FILES['myfile'], $file_path, $file_name);
// 	
// 	// Resize Image
// 	$image = new SimpleImage(); 
// 	$image->load($file_path . $file_name); 
// 	$image->resizeToHeight(180);
// 	$image->save($file_path . $file_name);
// 
// 	if ($image_response['status'] == '1') {
// 		$params["field"] = 'userImg';
// 		$params["value"] = $file_name;
// 	}
// }

// Update field
if ($params["id"] && $params["field"] && $params["value"]) {
	$result = TableUpdate($table, array("id" => $params["id"]), array($params["field"] => $params["value"]));
	if ($result) {
		$response = array(
			"success" => "true",
			"value" => $params["value"],
			"field" => $params["field"],
		);
	}
}

?>