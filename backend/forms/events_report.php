<?php
	require '../common.php';
	$params = get_params();
	$rows = array();

	// Is Coach?
	$user = TableRow('users', array(
		'id' => $params['user']
	));

	$isCoach = $user['coach'];
	$isCounselor = $user['counselor'];
	$isCaptain = $user['captain'];
	$isAdmin = $user['admin'];
	
	if ($isCoach) {
		$header = array('interviewer', 'first', 'last', 'phone', 'email', 'CBO', 'date', 'location', 'reason', 'duration', 'notes');
	} 
	elseif ($isCounselor) {
		$header = array('interviewer', 'first', 'last', 'DOB', 'CBO', 'date', 'location', 'reason', 'duration', 'notes');
	}
	elseif ($isCaptain) {
		$header = array('interviewer', 'coach', 'id', 'first', 'last', 'DOB', 'CBO', 'college', 'date', 'location', 'reason', 'duration', 'notes');
	}
	elseif ($isAdmin) {
		$header = array('interviewer', 'coach', 'id', 'first', 'last', 'DOB', 'CBO', 'college', 'date', 'location', 'reason', 'duration', 'notes');
	}

	// Get connections
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
		if ($isCoach) {
			array_push($row, $user['name']);
		} 
		elseif ($isCounselor) {
			array_push($row, $user['name']);
		}
		elseif ($isCaptain) {
			array_push($row, $user['name'], ($user['coach'] ? 'Yes' : 'No') );
		}
		elseif ($isAdmin) {
			array_push($row, $user['name'], ($user['coach'] ? 'Yes' : 'No') );
		}
		
		

		// Student Data
		$student = TableRow('students', array(
			'id' => $event['studentid']
		));
		
		if ($isCoach) {
			array_push($row, $student['fname'], $student['lname'], $student['phone'], $student['email'], $student['cbo']);
		} 
		elseif ($isCounselor) {
			array_push($row, $student['fname'], $student['lname'], $student['dob'], $student['cbo']);
		}
		elseif ($isCaptain) {
			array_push($row, $student['dbId'], $student['fname'], $student['lname'], $student['dob'], $student['cbo'], $student['college']);
		}
		elseif ($isAdmin) {
			array_push($row, $student['dbId'], $student['fname'], $student['lname'], $student['dob'], $student['cbo'], $student['college']);
		}
		
		// Event Data
		array_push($row, $event['timestamp'], $event['location'], $event['reason'], $event['duration'], $event['notes'], $event['signature']);
		
		array_push($rows, $row);
	}
	
	// Output file
	header("Content-type: text/csv");
	header("Content-Disposition: attachment; filename=events_" . date("Y.m.d.h.i") . ".csv");
	header("Pragma: no-cache");
	header("Expires: 0");
	echo implode(",", $header);
	foreach($rows as $row) {
		echo "\n" . implode(",", $row);
	}
	
	
?>