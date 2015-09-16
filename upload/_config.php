<?php
	require '../backend/common.php';
	lock();
	
	$params = get_params();
	$allowedExts = array("csv");
	$tables = array('students', 'users');
	$table = ($params['table'] ? $params['table'] : $tables[0]);
	
	function uploadSql($file, $table, $loggedInId, $createdTime) {
		$sql = array();
		$values = array();
		
		// File Data
		$file_data = get_file_data($file);
		$file_rows = $file_data['data'];
		$table_cols = $file_data['header'];

		foreach($file_rows as $key => $row) {
			$index = 0; $table_values = array();

			// Turn into array
			foreach($table_cols as $col) {
				if ($row[$index] || $row[$index] == '0') {
					$table_values[$col] = $row[$index];
				} else {
					$table_values[$col] = NULL;
				}
				$index++;
			}
			
			// Add uploadedBy & Timestamp
			$table_values['uploadedBy'] = $loggedInId;
			$table_values['createdTime'] = $createdTime;
			
			array_push($values, $table_values);
			array_push($sql, TableInsertSql($table, $table_values));
		}
		
		return array(
			'sql' => $sql,
			'values' => $values
		);
	}
	
	function validateFile($file, $table) {
		$con = DBConnect();
		$valid = true;
		

		// Logged in user
		$loggedInUser = loggedInUser();
		$loggedInId = $loggedInUser['id'];

		// Created time
		$createdTime = date('Y-m-d H:i:s.', time());
		
		// Get SQL
		$uplaod = uploadSql($file, $table, $loggedInId, $createdTime);
		$file_sqls = $uplaod['sql'];

		//Add to table
		foreach($file_sqls as $sql) {
			$result = mysql_query($sql);
			if (!$result) $valid = false;
		}

		//Revert insert
		$sql = 'DELETE FROM ' . $table . ' WHERE uploadedBy="' . $loggedInId . '" AND createdTime="' . $createdTime . '";';
		$result = mysql_query($sql);

		return $valid;
	}
	
	// Cleans out the fields we dont want user to see
	function uploadTableCols($t) {
		$tableCols = getTableColsByName($t);
		$csvCols = array();
	
		foreach($tableCols as $col => $structure) {
			if (strpos($structure, 'AUTO_INCREMENT') !== false) continue;
			if (strpos($structure, 'TIMESTAMP') !== false) continue;
			if (strpos($structure, 'NOT NULL') !== false) continue;
	
			if ($col == 'password') continue;
			if ($col == 'pwReset') continue;
			if ($col == 'uploadedBy') continue;
	
			array_push($csvCols, $col);
		}
		return $csvCols;
	}
	
	// Create data object of table cols
	function jsTableCols() {
		global $tables;
		
		echo "<script>\n";
		echo "tableCols = {\n";
		foreach($tables as $table) {
			$table_cols = uploadTableCols($table);
			echo $table . ":" . json_encode($table_cols) . ",\n";
		}
		echo "}\n";
		echo "</script>";
	}
?>