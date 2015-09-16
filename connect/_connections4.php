<?php
	require '_config.php';
	
	$params = get_params();
	$selectedUserId = $params['selectedUserId'];
	$type = $params['type'];
	$filter = $params['filter'];
	
	// Column config
	$colConfig = array(
		'student' => array('id', 'dbId', 'cbo', 'dob', 'fname', 'lname', 'school', 'college', 'major', 'notes'),
		'user' => array('id', 'name', 'email', 'admin', 'coach', 'counselor', 'captain', 'connect')
	);
	
	// Get logged in user
	$user = loggedInUser();
	$userId = $user['id'];
	$isAdmin = (loggedInAcl() == 'admin' ? true : false);
	
	// Get table columns
	$cols = $colConfig[$type];
	
	// Get universe data
	if ($type == 'student') {
		$universe = getConnectedStudentsOfLoggedinUser(false);
		$universeIds = $universe['ids'];
		$universeData = $universe['data'];
	} 
	else if ($type = 'user') {
		$universe = getConnectedUsersOfLoggedinUser(false);
		$universeIds = $universe['ids'];
		$universeData = $universe['data'];
		
		
		// Remove Filter
		foreach($universeData as $key => $value) {
			if ($universeData[$key][$filter] != '1') {
				unset($universeData[$key]);
				unset($universeIds[array_search($key, $universeIds)]);
			}
		}
	}
	
	// Get currently connected to selected user
	if ($type == 'student') {
		$connectedIds = getConnectedStudentIdsOfUsers($selectedUserId);
	} 
	else if ($type = 'user') {
		$connectedIds = getConnectedUserIdsOfUsers($selectedUserId);
	}
	
	// Hack to include current connected ids to universe
	$universeIds = array_merge($universeIds, $connectedIds);
	
	// Split universe by connections
	$splitData = splitByConnection($universeData, $connectedIds);
	
	$response = array(
		"count" => count($universeData),
		"success" => "true",
		"available" => $splitData['available'],
		"selected" => $splitData['selected'],
		"columns" => $cols,
		"params" => $params,
		"universe" => $universe
	);
	
	
	echo json_encode($response);
?>