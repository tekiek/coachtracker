<?php
	require '_config.php';
	$params = get_params();

	if ($params['cols']) {
		header("Content-type: text/csv");
		header("Content-Disposition: attachment; filename=cols_" . date("Y.m.d.h.i") . ".csv");
		header("Pragma: no-cache");
		header("Expires: 0");
		echo $params['cols'] . "\n";
	}
?>