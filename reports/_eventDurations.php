<?php

	require '../backend/common.php';
	
	$events_table = TableData('events');
	$events = table_to_array($events_table);
	$col = 'duration';
	$data = array();
	$response = array();
	$durations = ['00:05','00:10','00:15','00:20','00:30','00:45','01:00','01:15','01:30','02:00','02:30','03:00'];
	
	foreach($events as $event) {
		$key = $event[$col];
	
		// Clean up times
		if ($key == '5') { $key = '00:05'; }
		if ($key == '10') { $key = '00:10'; }
		if ($key == '15') { $key = '00:15'; }
		if ($key == '20') { $key = '00:20'; }
		if ($key == '30') { $key = '00:30'; }
		if ($key == '45') { $key = '00:45'; }
		if ($key == '60') { $key = '01:00'; }
		if ($key == '75') { $key = '01:15'; }
		if ($key == '90') { $key = '01:30'; }
		if ($key == '120') { $key = '02:00'; }
		if ($key == '150') { $key = '02:30'; }
		if ($key == '180') { $key = '03:00'; }
		
		if ($data[$key]) {
			$data[$key] = $data[$key] + 1;
		} else {
			$data[$key] = 1;
		}

	}
	
	foreach($durations as $time) {
		if ($data[$time]) {
			array_push($response, array(
				value => $data[$time],
				label  => $time
			));
		}
	}
	
	echo json_encode($response);
?>