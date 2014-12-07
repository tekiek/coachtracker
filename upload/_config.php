<?php
	require '../backend/common.php';
	lock();
	
	$params = get_params();
	$allowedExts = array("csv");
	$tables = array('students', 'users');
	$table = ($params['table'] ? $params['table'] : $tables[0]);
	
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
	
			array_push($csvCols, $col);
		}
		return $csvCols;
	}
?>