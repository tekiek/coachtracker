<?php

	require '_config.php';
	$params = get_params();
	$rows = array();
	$userid = $params['user'];
	$acl = getAcl($userid);

	// user config
	$config = array(
		'admin' => array(
			'headerLabels' => array('interviewer', 'first', 'last', 'date', 'location', 'duration', 'signature'),
			'header'=> array('name', 'fname', 'lname', 'timestamp', 'location', 'duration', 'signature'),
			'users' => array('name'),
			'students' => array('dbId', 'fname', 'lname', ),
			'event' => array('timestamp', 'location', 'duration', 'signature')
		),
		'captain' => array(
			'headerLabels' => array('interviewer', 'first', 'last', 'date', 'location', 'duration', 'signature'),
			'header'=> array('name', 'fname', 'lname', 'timestamp', 'location', 'duration', 'signature'),
			'users' => array('name'),
			'students' => array('dbId', 'fname', 'lname', ),
			'event' => array('timestamp', 'location', 'duration', 'signature')
		),
		'counselor' => array(
			'headerLabels' => array('interviewer', 'first', 'last', 'date', 'location', 'duration', 'signature'),
			'header'=> array('name', 'fname', 'lname', 'timestamp', 'location', 'duration', 'signature'),
			'users' => array('name'),
			'students' => array('dbId', 'fname', 'lname', ),
			'event' => array('timestamp', 'location', 'duration', 'signature')
		),
		'coach' => array(
			'headerLabels' => array('interviewer', 'first', 'last', 'date', 'location', 'duration', 'signature'),
			'header'=> array('name', 'fname', 'lname', 'timestamp', 'location', 'duration', 'signature'),
			'users' => array('name'),
			'students' => array('dbId', 'fname', 'lname', ),
			'event' => array('timestamp', 'location', 'duration', 'signature')
		)
	);
	$config = $config[$acl];
	
	// Get students connected to user
	$myStudents = getConnectedStudentIdsOfUsers($userid);
	$studentsData = getStudentsData($myStudents);
	
	// Get users connected to user
	$userData = getConnectedUsersOfUsers($userid);
	array_push($userData, TableRow('users', $user_cred));
	
	// Get all events
	$events = getEventDataByUsers($userid);
	
	// Row Data
	foreach($events as $event) {
		if (!in_array($event['studentid'], $myStudents)) { continue; }
		if ($params['fromDate'] && strtotime($params['fromDate']) > strtotime($event['timestamp'])) { continue; }
		if ($params['toDate'] && strtotime($params['toDate']) < strtotime($event['timestamp'])) { continue; }
	
		$row = array();
	
		// User Data
		$user = findInUniverse($userData, $event['userid']);
		foreach($config['users'] as $col) {
			$row[$col] = $user[$col];
		}
	
		// Student Data
		$student = findInUniverse($studentsData, $event['studentid']);
		foreach($config['students'] as $col) {
			$row[$col] = $student[$col];
		}
	
		// Event Data
		foreach($config['event'] as $col) {
			if ($col == 'signature' && $event[$col] != "") {
				$row[$col] = '<img src="' . $event[$col] . '">';
			} 
			else if ($col == 'timestamp') {
				$row[$col] = date("m-d-Y", strtotime($event[$col]));
			}
			else {
				$row[$col] = $event[$col];
			}
		}
		
		array_push($rows, $row);
	}

	$response = array(
		'rows' => $rows,
		'cols' => $config['header'],
		'colLabels' => $config['headerLabels'],
		'sort' => array_search('date', $config['headerLabels'])
	);
	echo json_encode($response);
?>