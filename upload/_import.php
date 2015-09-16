<?php

require '_config.php';
$params = get_params();
$con = DBConnect();

$response = array(
	"success" => "false",
	"params" => $params,
	"msg" => "Server Error!",
	"test" => ""
);

// Params
$failedRows = array();
$table = $params['table'];
$file_path = $params['file'];

// Logged in user
$loggedInUser = loggedInUser();
$loggedInId = $loggedInUser['id'];

// Loop through each row of data
$rowIds = array();
$connectionType = ($table == 'users' ? 'user' : 'student');

// Created time
$createdTime = date('Y-m-d H:i:s.', time());

// Get SQL
$uplaod = uploadSql($file_path, $table, $loggedInId, $createdTime);
$file_values = $uplaod['values'];
$file_sqls = $uplaod['sql'];

// Add to table
foreach($file_sqls as $sql) {
	$result = mysql_query($sql);
	logTableChange($sql, json_encode(debug_backtrace()));
}

// Add Connection
foreach($file_values as $fvalues) {
	$insertedRow = TableRow($table, $fvalues);
	
	if ($insertedRow && $insertedRow['id']) {
		$connectionParams = array(
			'type' 			=> $connectionType,
			'userid' 		=> $loggedInId,
			'connectionid'	=> $insertedRow['id'],
			'createdUser'	=> $loggedInId
		);
			
		// Add connection
		TableInsert('connections', $connectionParams);
	}
}

$response['success'] = "true";
$response['msg'] = 'Success!';


echo json_encode($response);
?>