<?php
	$table = "events";
	$tableConfig = tableEventsCols();

	if (TableCreate($table, $tableConfig)) {
		echo "Table Created: $table" . "<br>";
	} else {
		echo "Error creating table: " . mysql_error($con);
	}
?>