<?php

function isMobile() {
	$useragent=$_SERVER['HTTP_USER_AGENT'];
	if(preg_match('/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i',$useragent)||preg_match('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i',substr($useragent,0,4))) {
		return true;
	} else {
		return false;
	}
}

function findInUniverse($universe, $id) {
	foreach($universe as $i) {
		if ($i['id'] == $id) {
			return $i;
			break;
		}
	}
}

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
	$newData .= date("Y.m.d.h.i") . " : " . loginUserid() . " : " . $sql . "\n";
	file_put_contents($tableLogFile,  $newData, FILE_APPEND);
	return true;
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
		'file'		=> $name,
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