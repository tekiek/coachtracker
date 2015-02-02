<?php

/*
 * Get all connected students of user(s) - returns student table data
 */
function getConnectedUsersOfUsers($ids, $cols) {
	$userids = idsToArray($ids);
	$connectedUserIds = getConnectedUserIdsOfUsers($userids);
	$usersData = getUsersData($connectedUserIds, $cols);
	return $usersData;
}

/*
 * Get all user ids connected FROM user(s)
 */
function getConnectedUserIdsOfUsers($ids) {
	$userids = idsToArray($ids);

	// Get users that they have a connection TO
	//SELECT connectionid FROM connections WHERE type = 'user' AND (userid = 2 OR userid = 5)
	$sql = "SELECT connectionid FROM connections WHERE type = 'user' AND (";
	foreach($userids as $userid) {
		$sql .= 'userid = ' . $userid;
		if (end($userids) != $userid) { $sql .= " OR "; }
	}
	$sql .= ");";
	$connectionIds = queryColumn($sql);

	return $connectionIds;
}

/*
 * Get all user ids connected TO user(s)
 */
function getConnectedUserIdsToUsers($ids) {
	$userids = idsToArray($ids);

	// Get users that they have a connection FROM
	//SELECT userid FROM connections WHERE type = 'user' AND (connectionid = 4)
	$sql = "SELECT userid FROM connections WHERE type = 'user' AND (";
	foreach($userids as $userid) {
		$sql .= 'connectionid = ' . $userid;
		if (end($userids) != $userid) { $sql .= " OR "; }
	}
	$sql .= ");";
	$connectionIds = queryColumn($sql);

	return $connectionIds;
}

/*
 * Get all student data from a list of ids
 */
function getUsersData($ids, $cols) {
	$userids = idsToArray($ids);
	$cols = colsToSql($cols);
	
	// Get student table data
	// SELECT * FROM users WHERE (id = 1 OR id = 2 OR id = 3)
	$sql = "SELECT $cols FROM users WHERE (";
	foreach($userids as $userid) {
		$sql .= "id = " . $userid;
		if (end($userids) != $userid) { $sql .= " OR "; }
	}
	$sql .= ");";
	$users = queryTable($sql);
	
	return $users;
}



?>