<?php
	require '_config.php';
	$params = get_params();

	if ($params['table']) {

		//Get Table Cols
		$table_cols = uploadTableCols($params['table']);

		header('Content-Type: application/csv; charset=UTF-8');
		header("Content-Disposition: attachment; filename=" . $params['table'] . "-cols-" . date("m.d.Y") . ".csv");

		echo implode(",", $table_cols);
		echo "\n";
	}
?>