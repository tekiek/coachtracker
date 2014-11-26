<?php

	require '../common.php';
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
			'header'=> array('interviewer', 'coach', 'id', 'first', 'last', 'DOB', 'CBO', 'college', 'date', 'location', 'reason', 'duration', 'notes'),
			'users' => array('name', 'coach'),
			'students' => array('dbId', 'fname', 'lname', 'dob', 'cbo', 'college'),
			'event' => array('timestamp', 'location', 'reason', 'duration', 'notes')
		),
		'captain' => array(
			'header'=> array('interviewer', 'coach', 'id', 'first', 'last', 'DOB', 'CBO', 'college', 'date', 'location', 'reason', 'duration', 'notes'),
			'users' => array('name', 'coach'),
			'students' => array('dbId', 'fname', 'lname', 'dob', 'cbo', 'college'),
			'event' => array('timestamp', 'location', 'reason', 'duration', 'notes')
		),
		'counselor' => array(
			'header'=> array('interviewer', 'first', 'last', 'DOB', 'CBO', 'date', 'location', 'reason', 'duration', 'notes'),
			'users' => array('name'),
			'students' => array('fname', 'lname', 'dob', 'cbo'),
			'event' => array('timestamp', 'location', 'reason', 'duration', 'notes')
		),
		'coach' => array(
			'header'=> array('interviewer', 'first', 'last', 'phone', 'email', 'CBO', 'date', 'location', 'reason', 'duration', 'notes'),
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
	
	// Row Data
	foreach($events as $event) {
		if (!in_array($event['studentid'], $myStudents)) { continue; }
		$row = array();

		// User Data
		$user = TableRow('users', array(
			'id' => $event['userid']
		));
		foreach($config['users'] as $col) {
			array_push($row, $user[$col]);
		}

		// Student Data
		$student = TableRow('students', array(
			'id' => $event['studentid']
		));
		foreach($config['students'] as $col) {
			array_push($row, $student[$col]);
		}

		// Event Data
		foreach($config['event'] as $col) {
			array_push($row, $event[$col]);
		}
		
		array_push($rows, $row);
	}
	
	// Output file
	header("Content-type: text/csv");
	header("Content-Disposition: attachment; filename=events_" . date("Y.m.d.h.i") . ".csv");
	header("Pragma: no-cache");
	header("Expires: 0");
	echo implode(",", $config['header']);
	foreach($rows as $row) {
		echo "\n" . implode(",", $row);
	}
	
	
?>