<?php
	require '../backend/common.php';

	$params = get_params();
	$selected = array(); $available = array();
	$response = array(
		"success" => "false",
		"params" => $params
	);
	
	
	if ($params['userid']) {

		// Connections
		$connection_table = TableData('connections', array(
			'userid' => $params['userid'],
			'type' => $params['type']
		));
		$connections = table_to_array($connection_table);
		$connection_ids = array();
		foreach($connections as $connection) {
			array_push($connection_ids, $connection['connectionid']);
		}

		if ($params['type'] == 'student') {
			// Students
			$students_table_details = getTableColsByName('students');
			$students_table_cols = array_keys($students_table_details);
			$students_table = TableData('students', null);
			$students = table_to_array($students_table);

			// Split Students
			foreach($students as $student) {
				if (in_array($student['id'], $connection_ids)) {
					array_push($selected, $student); 
				} else {
					array_push($available, $student); 
				}
			}
			
			// Update response
			$response = array(
				"success" => "true",
				"available" => $available,
				"selected" => $selected,
				"columns" => $students_table_cols,
				"params" => $params
			);
		}
		if ($params['type'] == 'user') {
			// Users
			$users_filter = $params['filter'] ? array($params['filter'] => 1) : NULL;
			$users_table_details = getTableColsByName('users');
			$users_table_cols = array_keys($users_table_details);
			$users_table = TableData('users', $users_filter);
			$users = table_to_array($users_table);
			
			// Split Students
			foreach($users as $user) {
				if (in_array($user['id'], $connection_ids)) {
					array_push($selected, $user); 
				} else {
					array_push($available, $user); 
				}
			}
			
			$response = array(
				"success" => "true",
				"available" => $available,
				"selected" => $selected,
				"columns" => $users_table_cols,
				"params" => $params
			);
		}
	}

	echo json_encode($response);
?>