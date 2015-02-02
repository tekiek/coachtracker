<?php

/*
 * Gets users acl
 */
function getAcl($userid) {
	$acl;

	if ($userid) {
		$user_cred = array('id' => $userid);
		$user = TableRow('users', $user_cred);
		if ($user['admin'] == '1') $acl = 'admin';
		else if ($user['captain'] == '1') $acl = 'captain';
		else if ($user['coach'] == '1') $acl = 'coach';
		else if ($user['counselor'] == '1') $acl = 'counselor';
	}
	return $acl;
}

function logTableChange($sql, $caller) {
	$tableLogFile = logs_dir() . date('Y-m', time()) . ".txt";
	$newData = $caller . "\n";
	$newData .= date("Y.m.d.h.i") . " : " . loginUserid() . " : " . $sql . "\n";
	file_put_contents($tableLogFile,  $newData, FILE_APPEND);
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
 * Creates list of columns - If null returns *
 */
function colsToSql($cols) {

	if (gettype($cols) == 'array') {
		$sqlCols = implode(", ", $cols);
	} else {
		$sqlCols = "*";
	}
	return $sqlCols;
}

/*
 * Creates an array of any number of ids
 */
function idsToArray($ids) {
	$idsArray = array();
	
	// Clean up data
	if (gettype($ids) != 'array') {
		array_push($idsArray, $ids);
	}
	else if (gettype($ids) == 'array') {
		$idsArray = $ids;
	}
	return $idsArray;
}

?>