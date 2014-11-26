<?php

	require '../backend/common.php';
	$params = get_params();
	$rows = array();

	// Get User Details
	$user = TableRow('users', array(
		'id' => $params['user']
	));

	// Get Acl
	if ($user['admin']) { $acl = 'admin'; }
	else if ($user['captain']) { $acl = 'captain'; }
	else if ($user['counselor']) { $acl = 'counselor'; }
	else if ($user['coach']) { $acl = 'coach'; }

	// user config
	$config = array(
		'admin' => array(
			'headerLabels' => array('interviewer', 'coach', 'id', 'first', 'last', 'DOB', 'CBO', 'college', 'date', 'location', 'reason', 'duration', 'notes'),
			'header'=> array('name', 'coach', 'dbId', 'fname', 'lname', 'dob', 'cbo', 'college', 'timestamp', 'location', 'reason', 'duration', 'notes'),
			'users' => array('name', 'coach'),
			'students' => array('dbId', 'fname', 'lname', 'dob', 'cbo', 'college'),
			'event' => array('timestamp', 'location', 'reason', 'duration', 'notes', 'signature')
		),
		'captain' => array(
			'headerLabels' => array('interviewer', 'coach', 'id', 'first', 'last', 'DOB', 'CBO', 'college', 'date', 'location', 'reason', 'duration', 'notes'),
			'header'=> array('name', 'coach', 'dbId', 'fname', 'lname', 'dob', 'cbo', 'college', 'timestamp', 'location', 'reason', 'duration', 'notes'),
			'users' => array('name', 'coach'),
			'students' => array('dbId', 'fname', 'lname', 'dob', 'cbo', 'college'),
			'event' => array('timestamp', 'location', 'reason', 'duration', 'notes', 'signature')
		),
		'counselor' => array(
			'headerLabels' => array('interviewer', 'first', 'last', 'DOB', 'CBO', 'date', 'location', 'reason', 'duration', 'notes'),
			'header'=> array('name', 'fname', 'lname', 'dob', 'cbo', 'timestamp', 'location', 'reason', 'duration', 'notes'),
			'users' => array('name'),
			'students' => array('fname', 'lname', 'dob', 'cbo'),
			'event' => array('timestamp', 'location', 'reason', 'duration', 'notes', 'signature')
		),
		'coach' => array(
			'headerLabels' => array('interviewer', 'first', 'last', 'phone', 'email', 'CBO', 'date', 'location', 'reason', 'duration', 'notes'),
			'header'=> array('name', 'fname', 'lname', 'phone', 'email', 'cbo', 'timestamp', 'location', 'reason', 'duration', 'notes'),
			'users' => array('name'),
			'students' => array('fname', 'lname', 'phone', 'email', 'cbo'),
			'event' => array('timestamp', 'location', 'reason', 'duration', 'notes')
		)
	);
	$config = $config[$acl];
	
	// Get students connected to user
	$connections = getConnections('student', $params['user']);
	$myStudents = array();
	foreach($connections as $connection) {
		array_push($myStudents, $connection['id']);
	}
	
	// Get all events
	$events_table = TableData('events', array());
	$events = table_to_array($events_table);
	$events = array_reverse($events);
	
	// Row Data
	foreach($events as $event) {
		if (!in_array($event['studentid'], $myStudents)) { continue; }
		if ($params['fromDate'] && strtotime($params['fromDate']) > strtotime($event['timestamp'])) { continue; }
		if ($params['toDate'] && strtotime($params['toDate']) < strtotime($event['timestamp'])) { continue; }
	
		$row = array();
	
		// User Data
		$user = TableRow('users', array(
			'id' => $event['userid']
		));
		foreach($config['users'] as $col) {
			$row[$col] = $user[$col];
		}
	
		// Student Data
		$student = TableRow('students', array(
			'id' => $event['studentid']
		));
		foreach($config['students'] as $col) {
			$row[$col] = $student[$col];
		}
	
		// Event Data
		foreach($config['event'] as $col) {
			$row[$col] = $event[$col];
		}
		
		array_push($rows, $row);
	}

	$response = array(
		'rows' => $rows,
		'cols' => $config['header'],
		'colLabels' => $config['headerLabels']
	);
	echo json_encode($response);
?>