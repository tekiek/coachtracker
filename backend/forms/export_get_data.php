<?php

	$rows = array();
	$max_count = 100000000; //($params['rows'] ? (int)$params['rows'] : (isMobile() ? 20 : 100));
	
	// user config
	if (!$params['table']) $params['table'] = 'events';
	$config = $config[$params['table']];
	$config = $config[$acl];
	$headerLabels = headerLabels($config['header']);
	
	// Get all events
	$events = getEventDataByUsers($myStudents);
	
	// Row Data
	foreach($events as $event) {
		if (!validEvent($params['table'], $event, $params)) { continue; }
		$row = array();
	
		// User Data
		$user = findInUniverse($userData, $event['userid']);
		foreach($config['users'] as $col) {
			if ($col == 'coach') {
				// Hack for if is coach or not
				$row[$col] = ($user[$col] == '1' ? 'Yes' : 'No');
			} else {
				$row[$col] = $user[$col];
			}
		}
	
		// Student Data
		$student = findInUniverse($studentsData, $event['studentid']);
		foreach($config['students'] as $col) {
			$row[$col] = $student[$col];
		}
	
		// Event Data
		foreach($config['event'] as $col) {
			if ($col == 'signature' && $event[$col] != "") {
				$row[$col] = '<img src="' . $event[$col] . '">';
			}
			elseif ($col == 'timestamp' || $col == 'dateInserted') {
				if (strtotime($event[$col]) > date_date_set(date_create(), 2000, 1, 1)) {
					$row[$col] = date("m-d-Y", strtotime($event[$col]));
				} else {
					$row[$col] = 'NA';
				}
			} else {
				$row[$col] = $event[$col];
			}
		}
		
		array_push($rows, $row);
		if (count($rows) >= $max_count) { break; }
	}
	
	
	$response = array(
		'rows' => $rows,
		'cols' => $config['header'],
		'colLabels' => $headerLabels,
		'sort' => array_search('date', $headerLabels),
		'params' => $params
	);
?>