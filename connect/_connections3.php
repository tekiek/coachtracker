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
	$user = $_SESSION["loggedin-user"];
	$userId = $user['id'];
	$isAdmin = $user['admin'];
	
	// Get table columns
	$cols = $colConfig[$type];
	
	// Get universe data
	if ($user['admin'] == '1') {
		$universeIds = ($type == 'student' ? getAllStudentIds() : getAllUserIds($filter));
		$universeData = ($type == 'student' ? getStudentsData($universeIds, $cols) : getUsersData($universeIds, $cols));
	} else {
		$universeIds = ($type == 'student' ? getConnectedStudentIdsOfUsers($userId) : getConnectedUserIdsOfUsers($userId));
		$universeData = ($type == 'student' ? getStudentsData($universeIds) : getUsersData($universeIds, $cols, $filter));
	}
	
	// Get currently connected to selected user
	$connectedIds = ($type == 'student' ? getConnectedStudentIdsOfUsers($selectedUserId) : getConnectedUserIdsOfUsers($selectedUserId));
	
	// Hack to include current connected ids to universe
	$universeIds = array_merge($universeIds, $connectedIds);
	
	// Split universe by connections
	$splitData = splitByConnection($universeData, $connectedIds);
	
	$response = array(
		"success" => "true",
		"available" => $splitData['available'],
		"selected" => $splitData['selected'],
		"columns" => $cols,
		"params" => $params
	);
	
	
	echo json_encode($response);
?>