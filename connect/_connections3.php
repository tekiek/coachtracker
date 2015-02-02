<?php
	require '_config.php';
	
	$params = get_params();
	$userid = $params['userid'];
	$type = $params['type'];
	$filter = $params['filter'];
	$acl = getAcl($userid);
	
	// Get table columns
	if ($type == 'student') {
		$tableDetails = getTableColsByName('students');
	}
	else if ($type == 'user') {
		$tableDetails = getTableColsByName('users');
	}
	$tableCols = array_keys($tableDetails);
	
	// Admin
	if ($acl == 'admin' || $acl == 'captain') {
		// Get universe
		$universeIds = ($type == 'student' ? getAllStudentIds() : getAllUserIds($filter));
		$universeData = ($type == 'student' ? getStudentsData($universeIds) : getUsersData($universeIds));
	} else {
		// Get superior ids
		$superiorIds = getConnectedUserIdsToUsers($userid);
		
		// Get universe
		$universeIds = ($type == 'student' ? getConnectedStudentIdsOfUsers($superiorIds) : getConnectedUserIdsOfUsers($superiorIds));
		$universeData = ($type == 'student' ? getStudentsData($universeIds) : getUsersData($universeIds));
	}
	
	// Get currently connected
	$connectedIds = ($type == 'student' ? getConnectedStudentIdsOfUsers($userid) : getConnectedUserIdsOfUsers($userid));
	
	// Hack to include current connected ids to universe
	$universeIds = array_merge($universeIds, $connectedIds);
	
	// Split universe by connections
	$splitData = splitByConnection($universeData, $connectedIds);
	
	$response = array(
		"success" => "true",
		"available" => $splitData['available'],
		"selected" => $splitData['selected'],
		"columns" => $tableCols,
		"params" => $params
	);
	
	
	echo json_encode($response);
?>