<?php

	require '../backend/common.php';
	
	$events_table = TableData('events');
	$events = table_to_array($events_table);
	$col = 'timestamp';
	$data = array();
	$response = array();
	$months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	foreach($events as $event) {
		$date = strtotime($event[$col]);
		$month = $months[date('m', $date) - 1];
		
		if ($data[$month]) {
			$data[$month] = $data[$month] + 1;
		} else {
			$data[$month] = 1;
		}
	}
	
	foreach($months as $month) {
		if ($data[$month]) {
			array_push($response, array(
				value => $data[$month],
				label  => $month
			));
		}
	}
	
	// Add total count
	array_push($response, array(
		value => count($events),
		label  => 'Total'
	));
	
	
	echo json_encode($response);
?>