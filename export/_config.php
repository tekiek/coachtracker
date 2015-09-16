<?php
	require '../backend/common.php';
	lock();
	
	$params = get_params();
	$tables = array(
		'events' => 'Meeting Notes', 
		'emailBlast' => 'Email Blast', 
		'signatures' => 'Signatures'
	);
	
	// Logged in user
	$user = loggedInUser();
	$userid = $user['id'];
	$acl = usersAcl($user);
	
	// Get students connected to user
	$connectedStudents = getConnectedStudentsOfLoggedinUser();
	$myStudents = $connectedStudents['ids'];
	$studentsData = $connectedStudents['data'];
	
	// Get users connected to student
	$userData = getConnectedUsersOfStudents($myStudents);
	array_push($userData, $user);
	
	// Determines if event should be added
	function validEvent($table, $event, $params) {
		$valid = true;
		global $myStudents;

		if (!in_array($event['studentid'], $myStudents)) { 
			$valid = false; 
		}
		elseif ($params['fromDate'] && strtotime($params['fromDate']) > strtotime($event['timestamp'])) { 
			$valid = false; 
		}
		elseif ($params['toDate'] && strtotime($params['toDate'] . '+ 1 day') < strtotime($event['timestamp'])) { 
			$valid = false;  
		}
		elseif ($table == 'events') {
			if ($event['location'] == 'Email Blast') { 
				$valid = false; 
			}
		}
		elseif ($table == 'emailBlast') {
			if ($event['location'] != 'Email Blast') { 
				$valid = false; 
			}
		}
		elseif ($table == 'signatures') {
			if ($event['signature'] == "") { 
				$valid = false; 
			}
		}
		
		return $valid;
	}
	
	function headerLabels($headers) {
		$headerLabels = array();
		$map = array(
			'dateInserted' => 'entered',
			'id' => 'id',
			'name' => 'interviewer',
			'coach' => 'coach',
			'dbId' => 'dbId',
			'fname' => 'first',
			'lname' => 'last',
			'dob' => 'DOB',
			'cbo' => 'CBO',
			'college' => 'college',
			'timestamp' => 'date',
			'location' => 'location',
			'reason' => 'reason',
			'duration' => 'duration',
			'notes' => 'notes'
		);

		foreach($headers as $header) {
			if ($map[$header]) {
				array_push($headerLabels, $map[$header]);
			} else {
				array_push($headerLabels, $header);
			}
		}
		
		return $headerLabels;
	}

	// Data Config
	$config = array(
		'events' => array(
			'admin' => array(
				'header'=> array('dateInserted', 'id', 'name', 'coach', 'dbId', 'fname', 'lname', 'dob', 'cbo', 'college', 'timestamp', 'location', 'reason', 'duration', 'notes'),
				'users' => array('name', 'coach'),
				'students' => array('id', 'dbId', 'fname', 'lname', 'dob', 'cbo', 'college'),
				'event' => array('userid', 'studentid', 'dateInserted', 'id','timestamp', 'location', 'reason', 'duration', 'notes')
			),
			'captain' => array(
				'header'=> array('dateInserted', 'id', 'name', 'coach', 'dbId', 'fname', 'lname', 'dob', 'cbo', 'college', 'timestamp', 'location', 'reason', 'duration', 'notes'),
				'users' => array('name', 'coach'),
				'students' => array('id', 'dbId', 'fname', 'lname', 'dob', 'cbo', 'college'),
				'event' => array('userid', 'studentid', 'dateInserted', 'id', 'timestamp', 'location', 'reason', 'duration', 'notes')
			),
			'counselor' => array(
				'header'=> array('id', 'name', 'fname', 'lname', 'dob', 'cbo', 'college', 'timestamp', 'location', 'reason', 'duration', 'notes'),
				'users' => array('name'),
				'students' => array('id', 'fname', 'lname', 'dob', 'cbo', 'college'),
				'event' => array('userid', 'studentid', 'id', 'timestamp', 'location', 'reason', 'duration', 'notes')
			),
			'coach' => array(
				'header'=> array('id', 'name', 'fname', 'lname', 'phone', 'email', 'cbo', 'timestamp', 'location', 'reason', 'duration', 'notes'),
				'users' => array('name'),
				'students' => array('id', 'fname', 'lname', 'phone', 'email', 'cbo'),
				'event' => array('userid', 'studentid', 'id', 'timestamp', 'location', 'reason', 'duration', 'notes')
			)
		),
		'emailBlast' => array(
			'admin' => array(
				'header'=> array('dateInserted', 'id', 'name', 'coach', 'dbId', 'fname', 'lname', 'dob', 'cbo', 'college', 'timestamp', 'location', 'reason', 'notes'),
				'users' => array('name', 'coach'),
				'students' => array('id', 'dbId', 'fname', 'lname', 'dob', 'cbo', 'college'),
				'event' => array('userid', 'studentid', 'dateInserted', 'id','timestamp', 'location', 'reason', 'notes')
			),
			'captain' => array(
				'header'=> array('dateInserted', 'id', 'name', 'coach', 'dbId', 'fname', 'lname', 'dob', 'cbo', 'college', 'timestamp', 'location', 'reason', 'notes'),
				'users' => array('name', 'coach'),
				'students' => array('id', 'dbId', 'fname', 'lname', 'dob', 'cbo', 'college'),
				'event' => array('userid', 'studentid', 'dateInserted', 'id', 'timestamp', 'location', 'reason', 'notes')
			),
			'counselor' => array(
				'header'=> array('id', 'name', 'fname', 'lname', 'dob', 'cbo', 'college', 'timestamp', 'location', 'reason', 'notes'),
				'users' => array('name'),
				'students' => array('id', 'fname', 'lname', 'dob', 'cbo', 'college'),
				'event' => array('userid', 'studentid', 'id', 'timestamp', 'location', 'reason', 'notes')
			),
			'coach' => array(
				'header'=> array('id', 'name', 'fname', 'lname', 'phone', 'email', 'cbo', 'timestamp', 'location', 'reason', 'notes'),
				'users' => array('name'),
				'students' => array('id', 'fname', 'lname', 'phone', 'email', 'cbo'),
				'event' => array('userid', 'studentid', 'id', 'timestamp', 'location', 'reason', 'notes')
			)
		),
		'signatures' => array(
			'admin' => array(
				'header'=> array('name', 'fname', 'lname', 'timestamp', 'location', 'duration', 'signature'),
				'users' => array('name'),
				'students' => array('dbId', 'fname', 'lname', ),
				'event' => array('timestamp', 'location', 'duration', 'signature')
			),
			'captain' => array(
				'header'=> array('name', 'fname', 'lname', 'timestamp', 'location', 'duration', 'signature'),
				'users' => array('name'),
				'students' => array('dbId', 'fname', 'lname', ),
				'event' => array('timestamp', 'location', 'duration', 'signature')
			),
			'counselor' => array(
				'header'=> array('name', 'fname', 'lname', 'timestamp', 'location', 'duration', 'signature'),
				'users' => array('name'),
				'students' => array('dbId', 'fname', 'lname', ),
				'event' => array('timestamp', 'location', 'duration', 'signature')
			),
			'coach' => array(
				'header'=> array('name', 'fname', 'lname', 'timestamp', 'location', 'duration', 'signature'),
				'users' => array('name'),
				'students' => array('dbId', 'fname', 'lname', ),
				'event' => array('timestamp', 'location', 'duration', 'signature')
			)
		)
	);

?>