<?php
	require '../common.php';
	lock();
	$table = 'events';
	$col = 'followup';
	
	TableAddCol($table, $col);
	
	echo "Table: " . $table . "<br>";
	echo "Action: Add Col " . $col . "<br>";
?>