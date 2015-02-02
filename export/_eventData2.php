<?php

	require '_config.php';
	$params = get_params();
	$rows = array();
	$userid = $params['user'];
	$acl = getAcl($userid);

	// user config
	$config = array(
		'admin' => array(
			'headerLabels' => array('entered', 'id', 'interviewer', 'coach', 'dbId', 'first', 'last', 'DOB', 'CBO', 'college', 'date', 'location', 'reason', 'duration', 'notes'),
			'header'=> array('dateInserted', 'id', 'name', 'coach', 'dbId', 'fname', 'lname', 'dob', 'cbo', 'college', 'timestamp', 'location', 'reason', 'duration', 'notes'),
			'users' => array('name', 'coach'),
			'students' => array('dbId', 'fname', 'lname', 'dob', 'cbo', 'college'),
			'event' => array('dateInserted', 'id','timestamp', 'location', 'reason', 'duration', 'notes')
		),
		'captain' => array(
			'headerLabels' => array('entered', 'id', 'interviewer', 'coach', 'dbId', 'first', 'last', 'DOB', 'CBO', 'college', 'date', 'location', 'reason', 'duration', 'notes'),
			'header'=> array('dateInserted', 'id', 'name', 'coach', 'dbId', 'fname', 'lname', 'dob', 'cbo', 'college', 'timestamp', 'location', 'reason', 'duration', 'notes'),
			'users' => array('name', 'coach'),
			'students' => array('dbId', 'fname', 'lname', 'dob', 'cbo', 'college'),
			'event' => array('dateInserted', 'id', 'timestamp', 'location', 'reason', 'duration', 'notes')
		),
		'counselor' => array(
			'headerLabels' => array('id', 'interviewer', 'first', 'last', 'DOB', 'CBO', 'college', 'date', 'location', 'reason', 'duration', 'notes'),
			'header'=> array('id', 'name', 'fname', 'lname', 'dob', 'cbo', 'college', 'timestamp', 'location', 'reason', 'duration', 'notes'),
			'users' => array('name'),
			'students' => array('fname', 'lname', 'dob', 'cbo', 'college'),
			'event' => array('id', 'timestamp', 'location', 'reason', 'duration', 'notes')
		),
		'coach' => array(
			'headerLabels' => array('id', 'interviewer', 'first', 'last', 'phone', 'email', 'CBO', 'date', 'location', 'reason', 'duration', 'notes'),
			'header'=> array('id', 'name', 'fname', 'lname', 'phone', 'email', 'cbo', 'timestamp', 'location', 'reason', 'duration', 'notes'),
			'users' => array('name'),
			'students' => array('fname', 'lname', 'phone', 'email', 'cbo'),
			'event' => array('id', 'timestamp', 'location', 'reason', 'duration', 'notes')
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
	$poop;
	foreach($events as $event) {
		if (!in_array($event['studentid'], $myStudents)) { continue; }
		if ($params['fromDate'] && strtotime($params['fromDate']) > strtotime($event['timestamp'])) { continue; }
		if ($params['toDate'] && strtotime($params['toDate'] . '+ 1 day') < strtotime($event['timestamp'])) { continue; }
		$row = array();
	
		// User Data
		$user = findInUniverse($userData, $event['userid']);
		foreach($config['users'] as $col) {
			if ($col == 'coach') {
				// Hack for if is coach or not
				$row[$col] = ($user[$col] == '1' ? 'Yes' : 'No');
			} else {
				$row[$col] = $user[$col];
			}
		}
	
		// Student Data
		$student = findInUniverse($studentsData, $event['studentid']);
		foreach($config['students'] as $col) {
			$row[$col] = $student[$col];
		}
	
		// Event Data
		foreach($config['event'] as $col) {
			if ($col == 'timestamp' || $col == 'dateInserted') {
				if (strtotime($event[$col]) > date_date_set(date_create(), 2000, 1, 1)) {
					$row[$col] = date("m-d-Y", strtotime($event[$col]));
				} else {
					$row[$col] = 'NA';
				}
			} else {
				$row[$col] = $event[$col];
			}
		}
		
		array_push($rows, $row);
	}
	

	$response = array(
		'rows' => $rows,
		'cols' => $config['header'],
		'colLabels' => $config['headerLabels'],
		'sort' => array_search('date', $config['headerLabels']),
		'acl' => $acl,
		'test' => $studentsData
	);
	echo json_encode($response);
?>