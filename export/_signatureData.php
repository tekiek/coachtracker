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