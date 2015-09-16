<?php

require '../common.php';
lock();

//Create Tables
// foreach($tables as $table) {
// 	$cols = getTableColsByName($table);
// 	TableCreate($table, $cols, 'stage');
// }

// // Populate Tables
foreach($tables as $table) {
	$sql = "INSERT INTO stage_jerkface." . $table . " SELECT * FROM jerkface." . $table . ";";
	echo $sql;
	//mysql_query($sql);
}

//echo "FINISHED";
?>