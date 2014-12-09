<?php
	require '../common.php';
	$table = 'events';
	$col = 'followup';
	
	TableAddCol($table, $col);
	echo "Table: " . $table . " Updated.";
?>