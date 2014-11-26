<?php
	require '../common.php';
	$params = get_params();
	
	if ($params['table'] && $params['col']) {
		$table_data = TableData($params['table'], NULL);
		$table_cols = getTableColsByName($params['table']);
		$table_structure = $table_cols[$params['col']];
		$col_values = array();

		// Get Column Values
		while ($row = mysql_fetch_assoc($table_data)) {
			array_push($col_values, $row[$params['col']]);
		}
		
		$response = array(
			'values' => $col_values,
			'structure' => $table_structure
		);

		echo json_encode($response);
	}
?>