<?php
	require '../common.php';
	$params = get_params();
	$tables = array();

	// Select Cols
	$sql = 'SELECT ';
	foreach ($params['cols'] as $key => $col) {
		array_push($tables, $col['table']);
		$sql .= $col['table'] . '.' . $col['col'];
		if ($key != end(array_keys($params['cols']))) { $sql .= ", "; }
	}
	
	// From Tables
	$tables = array_unique($tables);
	$sql .= ' FROM ';
	foreach ($tables as $key => $table) {
		$sql .= $tables[$key];
		if ($key != end(array_keys($tables))) { $sql .= ", "; }
	}
	
	// Filters
	if (count($params['filters']) > 0) {
		$sql .= ' WHERE ';
		foreach ($params['filters'] as $key => $entry) {
			$sql .= '(';
			foreach ($entry['filters'] as $filterKey => $value) {
				$sql .= $entry['table'] . '.' . $entry['col'] . ' = "' . $value . '"';
				if ($filterKey != end(array_keys($entry['filters']))) { $sql .= " OR "; }
			}
			$sql .= ') ';
			if ($key != end(array_keys($params['filters']))) { $sql .= " AND "; }
		}
	}
	
	// Join
	if (in_array("students", $tables) && in_array("events", $tables)) {
		$sql .= (strpos($sql, 'WHERE') === false ? ' WHERE ' : ' AND ');
		$sql .= 'students.id = events.studentid';
	}
	if (in_array("users", $tables) && in_array("events", $tables)) {
		$sql .= (strpos($sql, 'WHERE') === false ? ' WHERE ' : ' AND ');
		$sql .= 'users.id = events.userid';
	}
	
	// Close
	$sql .= ';';
	
	// Get Data
	DBConnect();
	$table_data = mysql_query($sql);
	$data_response = array();

	while ($row = mysql_fetch_assoc($table_data)) {
		$result = array();
		foreach($row as $column => $value) {
			$result[$column] = $value;
		}
		array_push($data_response, $result);
	}
	
	$response['sql'] = $sql;
	$response['data'] = $data_response;
	echo json_encode($response);
?>