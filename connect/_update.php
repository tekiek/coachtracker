<?php
	require '../backend/common.php';
	$params = get_params();
	$table = 'connections';
	$response = array(
		'success' => '0',
		'params' => $params
	);
	
	if ($params['userid'] && $params['ids'] && $params['action']) {
		$userid = $params['userid'];
		$ids = $params['ids'];
		$action = $params['action'];
		$result = false;

		// Add Connection
		if ($action == 'add' && $params['type']) {
			$type = $params['type'];

			foreach($ids as $id) {
				$table_values = array(
					'type' 			=> $type,
					'userid' 		=> $userid,
					'connectionid'	=> $id
				);
				$result = TableInsert($table, $table_values);
			}
		}

		// Remove Connection
		if ($action == 'remove') {
			$ANDs = array();
			$ORs = array();

			// ANDs
			array_push($ANDs, array(
				'userid' => $userid
			));

			// ORs
			foreach($ids as $id) {
				array_push($ORs, array(
					'connectionid' => $id
				));
			}

			$result = TableDelete($table, $ORs, $ANDs);
		}
		
		if ($result) {
			$response = array(
				'success' => '1',
				'students' => $ids
			);
		}
	}

	echo json_encode($response);
?>