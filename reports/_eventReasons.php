<?php

	require '../backend/common.php';
	
	$events_table = TableData('events');
	$events = table_to_array($events_table);
	$data = array();
	$response = array();
	
	foreach($events as $event) {
		$reasons = explode(";", $event['reason']);
		
		foreach($reasons as $reason) {
			if ($data[$reason]) {
				$data[$reason] = $data[$reason] + 1;
			} else {
				$data[$reason] = 1;
			}
		}
	}
	
	foreach($data as $key => $value) {
		array_push($response, array(
			value => $value,
			label  => $key
		));
	}
	
	echo json_encode($response);
?>