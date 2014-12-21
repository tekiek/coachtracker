<?php
	require '../common.php';
	$table = 'events';

	// Get all events
	$events_table = TableData($table, array());
	$events = table_to_array($events_table);
	$last_date = null;
	
	foreach($events as $event) {
		if ($event['timestamp'] == '0000-00-00 00:00:00' && $last_date != null) {
			$match = array(
				'id' => $event['id']
			);
			$update = array(
				'timestamp' => $last_date
			);
			TableUpdate($table, $match, $update);
			echo "Updated: " . $event['id'] . " TO: " . $last_date;
			echo "<br>";
		} else {
			$last_date = $event['timestamp'];
		}
	}
?>