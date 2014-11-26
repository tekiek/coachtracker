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
	
	function getUserList() {
		$users_table = TableData('users', array(), 'name');
		$users = table_to_array($users_table);
		return $users;
	}
	
	

?>