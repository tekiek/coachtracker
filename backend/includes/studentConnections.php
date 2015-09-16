<?php

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
 * Get all users
 */
function getAllStudents($cols) {
	$cols = colsToSql($cols);
	
	// Get all users data
	$sql = "SELECT $cols FROM students ORDER BY fname ASC";
	$studentData = queryTable($sql);
	
	// Get Ids
	$studentIds = array();
	foreach($studentData as $student) {
		if ($student['id']) {
			array_push($studentIds, $student['id']);
		}
	}
	
	return array(
		'ids' => $studentIds,
		'data' => $studentData
	);
}

/*
 * Get all connected students of user(s) - returns student table data
 */
function getConnectedStudentsOfUsers($ids, $cols) {
	$userids = idsToArray($ids);
	$connectedStudentIds = getConnectedStudentIdsOfUsers($userids);
	$studentsData = getStudentsData($connectedStudentIds, $cols);

	return array(
		'ids' => $connectedStudentIds,
		'data' => $studentsData
	);
}

/*
 * Get all connected users of student(s) - returns user table data
 */
function getConnectedUsersOfStudents($ids, $cols) {
	$userids = idsToArray($ids);
	$connectedUserIds = getConnectedUserIdsOfStudents($userids);
	$usersData = getUsersData(array_unique($connectedUserIds), $cols);
	return $usersData;
	return $connectedUserIds;
}

/*
 * Get all student ids connected to user(s)
 */
function getConnectedStudentIdsOfUsers($ids) {
	$userids = idsToArray($ids);

	// Get student ids from connection table
	//SELECT connectionid FROM connections WHERE type = 'student' AND (userid = 2 OR userid = 5)
	$sql = "SELECT connectionid FROM connections WHERE type = 'student' AND (";
	foreach($userids as $userid) {
		$sql .= 'userid = ' . $userid;
		if (end($userids) != $userid) { $sql .= " OR "; }
	}
	$sql .= ");";
	$connections = queryColumn($sql);

	return $connections;
}

/*
 * Get all user ids connected to student(s)
 */
function getConnectedUserIdsOfStudents($ids) {
	$userids = idsToArray($ids);

	// Get user ids from connection table
	//SELECT connectionid FROM connections WHERE type = 'student' AND (connectionid = 2 OR connectionid = 5)
	$sql = "SELECT userid FROM connections WHERE type = 'student' AND (";
	foreach($userids as $userid) {
		$sql .= 'connectionid = ' . $userid;
		if (end($userids) != $userid) { $sql .= " OR "; }
	}
	$sql .= ");";
	$connections = queryColumn($sql);

	return $connections;
}

/*
 * Get all student data from a list of ids
 */
function getStudentsData($ids, $cols) {
	$userids = idsToArray($ids);
	$cols = colsToSql($cols);
	
	// Get student table data
	// SELECT * FROM students WHERE (id = 1 OR id = 2 OR id = 3)
	$sql = "SELECT $cols FROM students WHERE (";
	foreach($userids as $userid) {
		$sql .= "id = " . $userid;
		if (end($userids) != $userid) { $sql .= " OR "; }
	}
	$sql .= ");";
	$students = queryTable($sql);
	
	return $students;
}

?>