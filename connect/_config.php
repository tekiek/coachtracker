<?php
	require '../backend/common.php';
	lock();
	
	$params = get_params();
	
	// Tab Config
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
	
	// Logged in user
	$loggedInUser = loggedInUser();
	$loggedInId = $loggedInUser['id'];
	
	// Get user list
	$users = getConnectedUsersOfLoggedinUser(false)['data'];
	array_unshift($users, $loggedInUser);
	
	// Selected user
	$selectedUserId = ($params['user'] ? $params['user'] : $users[0]['id']);
	$selectedUser = findInUniverse($users, $selectedUserId);
	$selectedUserAcl = usersAcl($selectedUser);
?>