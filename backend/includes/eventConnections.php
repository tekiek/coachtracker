<?php

/*
 * Get all student data from a list of ids
 */
function getEventDataByUsers($ids, $cols) {
	$userids = idsToArray($ids);
	$cols = colsToSql($cols);
	
	// Get student table data
	// SELECT * FROM events WHERE (userid = 1 OR userid = 2)
	$sql = "SELECT $cols FROM events WHERE (";
	foreach($userids as $userid) {
		$sql .= "userid = " . $userid;
		if (end($userids) != $userid) { $sql .= " OR "; }
	}
	$sql .= ");";
	$events = queryTable($sql);
	
	return $events;
}

?>