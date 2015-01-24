<?php
	require '../backend/common.php';

	$params = get_params();
	$selected = array(); 
	$available = array();
	$response = array(
		"success" => "false",
		"params" => $params
	);
	
	
	if ($params['userid']) {

		// Get superior ids
		$superiors = getConnections('user', $params['userid']);
		$superiorIds = array();
		foreach($superiors as $superior) {
			array_push($superiorIds, $superior['id']);
		}

		if ($params['type'] == 'student') {
			$students = array();
			$studentIds = array();
			$userConnectionIds = array();
			
			// Get Superiors student universe
			foreach($superiorIds as $superiorId) {
				$superiorStudents = getConnections('student', $superiorId);
				foreach($superiorStudents as $superiorStudent) {
					if (!in_array($superiorStudent['id'], $studentIds)) {
						array_push($students, $superiorStudent);
						array_push($studentIds, $superiorStudent['id']);
					}
				}
			}
			
			// Get current connection IDs
			$usersConnections = getConnections('student', $params['userid']);
			foreach($usersConnections as $usersConnection) {
				array_push($userConnectionIds, $usersConnection['id']);

				// Add to universe
				if (!in_array($usersConnection['id'], $studentIds)) {
					array_push($studentIds, $usersConnection['id']);
					array_push($students, $usersConnection);
				}
			}
			
			// Split students
			foreach($students as $student) {
				if (in_array($student['id'], $userConnectionIds)) {
					array_push($selected, $student); 
				} else {
					array_push($available, $student); 
				}
			}
			
			// Table columns
			$students_table_details = getTableColsByName('students');
			$students_table_cols = array_keys($students_table_details);
			
			// Update response
			$response = array(
				"success" => "true",
				"available" => $available,
				"selected" => $selected,
				"columns" => $students_table_cols,
				"params" => $params,
				"superiors" => count($superiorIds)
			);
		}
		
		if ($params['type'] == 'user') {
			$users = array();
			$userIds = array();
			$userConnectionIds = array();
			
			// Add superiors
			foreach($superiors as $superior) {
				if (!in_array($superior['id'], $userIds)) {
					array_push($userIds, $superior['id']);
					array_push($users, $superior);
				}
			}
			
			// Add superior connections
			foreach($superiorIds as $superiorId) {
				$underlings = getConnections('user', $superiorId);
				foreach($underlings as $underling) {
					if (!in_array($underling['id'], $userIds)) {
						array_push($userIds, $underling['id']);
						array_push($users, underling);
					}
				}
			}
			
			// Split students
			foreach($users as $user) {
				if ($user[$params['filter']] == 1) {
					if (in_array($user['id'], $userIds)) {
						array_push($selected, $user); 
					} else {
						array_push($available, $user); 
					}
				}
			}
			
			
			//echo count($users);
			print_r($selected);
			
			
			// // Get Superiors student universe
			// foreach($superiorIds as $superiorId) {
			// 	$superiorStudents = getConnections('student', $superiorId);
			// 	foreach($superiorStudents as $superiorStudent) {
			// 		if (!in_array($superiorStudent['id'], $studentIds)) {
			// 			array_push($students, $superiorStudent);
			// 			array_push($studentIds, $superiorStudent['id']);
			// 		}
			// 	}
			// }
			// 
			// // Users
			// $users_filter = $params['filter'] ? array($params['filter'] => 1) : NULL;
			// 
			// // Get users
			// $users_table = TableData('users', $users_filter);
			// $users = table_to_array($users_table);
			// 
			// // Split users
			// foreach($users as $user) {
			// 	if (in_array($user['id'], $connection_ids)) {
			// 		array_push($selected, $user); 
			// 	} else {
			// 		array_push($available, $user); 
			// 	}
			// }
			// 
			// // Table columns
			// $users_table_details = getTableColsByName('users');
			// $users_table_cols = array_keys($users_table_details);
			// 
			// $response = array(
			// 	"success" => "true",
			// 	"available" => $available,
			// 	"selected" => $selected,
			// 	"columns" => $users_table_cols,
			// 	"params" => $params
			// );
		}
	}

	//echo json_encode($response);
?>