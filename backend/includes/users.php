<?php

$sessionValues = array(
	"loggedin-user",
	"loggedin-user-userConnections",
	"loggedin-user-studentConnections",
	"connected-users-to-students",
);

/*
 * Returns connected users to logged in user
 *
 * returns array (ids, data)
 */
function getConnectedUsersOfLoggedinUser($cache) {
	session_start();
	if (gettype($cache) != 'boolean') $cache = true;
	$loggedInAcl = loggedInAcl();
	$loggedInUser = loggedInUser();
	$sessionId = "loggedin-user-userConnections";
	$connectedUsers = array(
		'id' => '',
		'data' => ''
	);

	if (isset($_SESSION[$sessionId]) && $cache) {
		$connectedUsers = $_SESSION[$sessionId];
	} else {
		if ($loggedInAcl && $loggedInUser) {
			if ($loggedInAcl == 'admin') {
				$_SESSION[$sessionId] = getAllUsers();
			} else {
				$_SESSION[$sessionId] = getConnectedUsersOfUsers($loggedInUser['id']);
			}
			$connectedUsers = $_SESSION[$sessionId];
		}
	}

	$connectedStudents['cache'] = $cache;
	return $connectedUsers;
}

/*
 * Returns connected students to logged in user
 *
 * returns array (ids, data)
 */
function getConnectedStudentsOfLoggedinUser($cache) {
	session_start();
	if (gettype($cache) != 'boolean') $cache = true;
	$loggedInAcl = loggedInAcl();
	$loggedInUser = loggedInUser();
	$sessionId = "loggedin-user-studentConnections";
	$connectedStudents = array(
		'ids' => '',
		'data' => ''
	);

	if (isset($_SESSION[$sessionId]) && $cache) {
		$connectedStudents = $_SESSION[$sessionId];
	} else {
		if ($loggedInAcl && $loggedInUser) {
			if ($loggedInAcl == 'admin') {
				$_SESSION[$sessionId] = getAllStudents();
			} else {
				$_SESSION[$sessionId] = getConnectedStudentsOfUsers($loggedInUser['id']);
			}
			$connectedStudents = $_SESSION[$sessionId];
		}
	}

	$connectedStudents['cache'] = $cache;
	return $connectedStudents;
}

/*
 * Returns acl from user data
 */
function usersAcl($user) {
	$acl;
	
	if ($user) {
		if ($user['admin'] == '1') $acl = 'admin';
		else if ($user['captain'] == '1') $acl = 'captain';
		else if ($user['coach'] == '1') $acl = 'coach';
		else if ($user['counselor'] == '1') $acl = 'counselor';
	}
	return $acl;
}

/*
 * Returns acl of logged in user
 */
function loggedInAcl() {
	$acl; session_start();

	if (isset($_SESSION["loggedin-user"])) {
		$user = $_SESSION["loggedin-user"];

		if ($user['admin'] == '1') $acl = 'admin';
		else if ($user['coach'] == '1') $acl = 'coach';
		else if ($user['counselor'] == '1') $acl = 'counselor';
		else if ($user['captain'] == '1') $acl = 'captain';
	}
	return $acl;
}

/*
 * Returns logged in user data
 */
function loggedInUser() {
	session_start();
	$user = array();

	if (isset($_SESSION["loggedin-user"])) { 
		$user = $_SESSION["loggedin-user"];
	}
	return $user;
}

function userLoggedIn($user) {
	session_start();
	$_SESSION["loggedin-user"] = $user;
}

function loginStatus() { 
	session_start();
	$login_status = false;
	
	if ($_SESSION["loggedin-user"]) { 
		$login_status = true; 
	}
	
	return $login_status;
};

function loginUserid() {
	session_start();
	if (loginStatus()) { 
		return $_SESSION['loggedin-user']['id']; 
	} else { 
		return NULL; 
	}
};

function userLogout() {
	session_start();
	global $sessionValues;

	foreach($sessionValues as $sessionValue) {
		if (isset($_SESSION[$sessionValue])) {
			unset($_SESSION[$sessionValue]);
		}
	}
	return true;
}

function lock() {
	session_start();

	if (loginStatus()) { 
		return NULL; 
	} else {
		userLogout();
		header('Location: ' . file_root() . '');
	}
};

?>