<?php
require 'users.php';
require 'db/table_config.php';
require 'db/db_connect.php';
require 'db/table_insert.php';
require 'db/table_data.php';
require 'db/table_row.php';
require 'db/table_count.php';
require 'db/table_update.php';
require 'db/table_create.php';
require 'db/table_delete.php';
require 'db/table_add_col.php';
require 'includes/elements.php';
require 'includes/externals.php';

function env() {
	if ($_SERVER['HTTP_HOST'] == 'coachtracker.org' || $_SERVER['HTTP_HOST'] == 'www.coachtracker.org') {
		return 'prod';
	} else {
		return 'dev';
	}
}

function root_dir() {
	return $_SERVER['DOCUMENT_ROOT'] . '/';
}

function file_root() {
	if (env() == 'prod') {
		return 'http://' . $_SERVER['HTTP_HOST'] . '/';
	} else {
		return 'http://localhost:8888/';
	}
}

function data_dir() {
	return root_dir() . "data/";
}

function students_image_dir() {
	return root_dir() . "images/students/";
}

function string_clean($str) {
	$str = stripslashes($str);
	$str = mysql_real_escape_string($str);
	return $str;
}

// Retrun array out of params
function get_params() {
	$params = array();
	
	// Get POST params
	foreach($_POST as $name => $value) {
		$params[$name] = $value;
	}
	
	// Get GET params
	foreach($_GET as $name => $value) {
		$params[$name] = $value;
	}

	return $params;
}

// SQL escape array
function sql_escape_array($array) {
	foreach($array as $key => $value) {
		$array[$key] = mysql_real_escape_string($value);
	}
	return $array;
}

// return true if last in array
function lastInArray(&$array, $key) {
	end($array);
	return $key === key($array);
}

// Copy file from one dir to another
function copy_file($file, $dir, $name) {
	$response = array(
		'image'		=> $name,
		'status'	=> '0'
	);

	if (!$file["error"] > 0) {
		move_uploaded_file($file["tmp_name"], $dir . $name);
		$response['status'] = '1';
	}

	return $response;
}

// create file
function write_file($file, $contents) {
	$fp = fopen($file, 'w');
	fwrite($fp, $contents);
	fclose($fp);
}

// Convert table response to array
function table_to_array($table) {
	$response = array(); $row_count = 0;

	while ($row = mysql_fetch_assoc($table)) {
		foreach($row as $column => $value) {
			$response[$row_count][$column] = $value;
		}
		++$row_count;
	}
	return $response;
}

// Get data from file. Returns Header line and data in array
function get_file_data($path) {
	$row = 1; $file_data = array(); $file_header = array();

	if (($handle = fopen($path, "r")) !== FALSE) {
		while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
			if ($row == 1) {
				$file_header = $data;
				$row++;
			} else {
				$row++;
				$file_data[] = $data;
			}
		}
		fclose($handle);
	}

	return array(
		'header' => $file_header,
		'data' => $file_data
	);
}

// send email
function SendMail($to, $subject, $body) {
	$headers = 'From: noreply@coachtracker.org' . "\r\n" .
	    'Reply-To: noreply@coachtracker.org';
	$body = wordwrap($body, 70); // message lines should not exceed 70 characters (PHP rule), so wrap it

	mail($to, $subject, $body, $headers);
}

// Cleans out the fields we dont want user to see
function uploadTableCols($table) {
	$csvCols = array();
	foreach($table as $col => $structure) {
		if (strpos($structure, 'AUTO_INCREMENT') !== false) continue;
		if (strpos($structure, 'TIMESTAMP') !== false) continue;
		if (strpos($structure, 'NOT NULL') !== false) continue;
		
		// users table
		if ($col == 'password') continue;
		if ($col == 'pwReset') continue;
		
		array_push($csvCols, $col);
	}
	return $csvCols;
}

function uploadCsv($table, $file) {
	$row = 0;
	$table_cols;
	if (($handle = fopen($file, "r")) !== FALSE) {
		while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
			if ($row == 0) {
				$table_cols = $data;
			} else {
				$file_data[] = $data ;
			}
			$row++;
		}
		fclose($handle);
	}
	
	// Add data to table
	foreach($file_data as $row) {
		$table_data = array(); $index = 0;

		foreach($table_cols as $col) {
			$table_data[$col] = $row[$index];
			$index++;
		}
		
		TableInsert($table, $table_data);
	}
}

/*
 * Get users or students connected to user
 * - $type (string) student | user
 * - $userid (int)
 */
function getConnections($type, $userid) {
	$response = array();
	
	// Connections
	$connection_table = TableData('connections', array(
		'userid' => $userid,
		'type' => $type
	));
	$connections = table_to_array($connection_table);
	$connection_ids = array();
	foreach($connections as $connection) {
		array_push($connection_ids, $connection['connectionid']);
	}
	
	// Superiors - Inverse
	if ($type == 'user') {
		$connection_table = TableData('connections', array(
			'connectionid' => $userid,
			'type' => $type
		));
		$connections = table_to_array($connection_table);
		foreach($connections as $connection) {
			array_push($connection_ids, $connection['userid']);
		}
	}
	
	// Get Students/Users
	$table = ($type == 'student' ? 'students' : 'users');
	$table_details = getTableColsByName($table);
	$table_cols = array_keys($table_details);
	$table_data = TableData($table, null);
	$data = table_to_array($table_data);
	
	// Split
	foreach($data as $d) {
		if (in_array($d['id'], $connection_ids)) {
			array_push($response, $d); 
		}
	}
	return $response;
}

?>