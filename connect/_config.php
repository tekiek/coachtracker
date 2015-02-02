<?php
	require '../backend/common.php';
	lock();
	
	$params = get_params();
	$users = getUserList();
	$user = ($params['user'] ? $params['user'] : $users[0]);
	$tabs = array(
		'Students' => array(
			'type' => 'student',
			'filter' => null
		),
		'Coaches' => array(
			'type' => 'user',
			'filter' => 'coach'
		),
		'Counselors' => array(
			'type' => 'user',
			'filter' => 'counselor'
		)
	);
	
	/*
	 * Get list of users
	 */
	function getUserList() {
		$users_table = TableData('users', array(), 'name');
		$users = table_to_array($users_table);
		return $users;
	}
	
	/*
	 * Returns all student ids
	 */
	function getAllStudentIds() {
		//SELECT id FROM students
		$sql = "SELECT id FROM students";
		$studentIds = queryColumn($sql);

		return $studentIds;
	}
	
	/*
	 * Returns all user ids
	 */
	function getAllUserIds($filter) {
		//SELECT id FROM students
		$sql = "SELECT id FROM users WHERE $filter = '1'";
		$userIds = queryColumn($sql);

		return $userIds;
	}

	/*
	 * Splits currently connections by universe
	 */
	function splitByConnection($universe, $connectionIds) {
		$selected = array();
		$available = array();
		$duplicateCheck = array();
		
		foreach($universe as $person) {
			if (!in_array($person['id'], $duplicateCheck)) {
				if (in_array($person['id'], $connectionIds)) {
					array_push($selected, $person); 
				} else {
					array_push($available, $person); 
				}
				array_push($duplicateCheck, $person['id']);
			}
		}
		
		return array(
			'selected' => $selected,
			'available' => $available
		);
	}
	
	

?>