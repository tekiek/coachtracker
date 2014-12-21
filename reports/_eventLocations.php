<?php

	require '../backend/common.php';
	
	$events_table = TableData('events');
	$events = table_to_array($events_table);
	$col = 'location';
	$data = array();
	$response = array();
	
	foreach($events as $event) {
		$location = $event[$col];
		
		if ($data[$location]) {
			$data[$location] = $data[$location] + 1;
		} else {
			$data[$location] = 1;
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