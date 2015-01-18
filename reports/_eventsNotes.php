<?php

	require '../backend/common.php';
	
	$events_table = TableData('events');
	$events = table_to_array($events_table);
	$col = 'notes';
	$data = array();
	$response = array();
	
	foreach($events as $event) {
		$note = $event[$col];
		$words = explode(' ', $note);

		foreach($words as $word) {
			if ($data[$word]) {
				$data[$word] = $data[$word] + 1;
			} else {
				$data[$word] = 1;
			}
		}
	}
	
	// foreach($months as $month) {
	// 	if ($data[$month]) {
	// 		array_push($response, array(
	// 			value => $data[$month],
	// 			label  => $month
	// 		));
	// 	}
	// }
	// 
	// // Add total count
	// array_push($response, array(
	// 	value => count($events),
	// 	label  => 'Total'
	// ));
	
	asort($data);
	foreach($data as $key => $value) {
		echo $value . ": " . $key;
		echo "<br>";
	}
	
	//echo json_encode($data);
?>