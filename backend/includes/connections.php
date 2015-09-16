<?php

/*
 * Splits currently connections by universe
 */
function splitByConnection($universe, $connectionIds) {
	$selected = array();
	$available = array();
	$duplicateCheck = array();
	
	foreach($universe as $person) {
		$personId = $person['id'];

		if (!isset($duplicateCheck[$personId])) {
			if (in_array($personId, $connectionIds)) {
				array_push($selected, $person);
			} else {
				array_push($available, $person);
			}
			$duplicateCheck[$personId] = 1;
		}
	}
	
	return array(
		'selected' => $selected,
		'available' => $available
	);
}

/*
 * Get users or students connected to user
 * - $type (string) student | user
 * - $userid (int)
 */
function getConnections($type, $userid) {
	$response = array();
	
	// Connections
	$connection_table = TableData('connections', array(
		'userid' => $userid,
		'type' => $type
	));
	$connections = table_to_array($connection_table);
	$connection_ids = array();
	foreach($connections as $connection) {
		array_push($connection_ids, $connection['connectionid']);
	}
	
	// Superiors - Inverse
	if ($type == 'user') {
		$connection_table = TableData('connections', array(
			'connectionid' => $userid,
			'type' => $type
		));
		$connections = table_to_array($connection_table);
		foreach($connections as $connection) {
			array_push($connection_ids, $connection['userid']);
		}
	}
	
	// Get Students/Users
	$table = ($type == 'student' ? 'students' : 'users');
	$table_details = getTableColsByName($table);
	$table_cols = array_keys($table_details);
	$table_data = TableData($table, null);
	$data = table_to_array($table_data);
	
	// Split
	foreach($data as $d) {
		if (in_array($d['id'], $connection_ids)) {
			array_push($response, $d); 
		}
	}
	return $response;
}

?>