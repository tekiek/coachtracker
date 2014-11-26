<?php
	$table = "connections";
	$tableConfig = tableConnections();

	if (TableCreate($table, $tableConfig)) {
		echo "Table Created: $table" . "<br>";
	} else {
		echo "Error creating table: " . mysql_error($con);
	}
	
	// Insert Data
	$path = "data/connections.csv";
	uploadCsv($table, $path);
?>