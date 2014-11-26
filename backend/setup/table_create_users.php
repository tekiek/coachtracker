<?php
	$table = "users";
	$tableConfig = tableUsersCols();

	if (TableCreate($table, $tableConfig)) {
		echo "Table Created: $table" . "<br>";
	} else {
		echo "Error creating table: " . mysql_error($con);
	}
	
	// Insert Data
	$path = "data/users.csv";
	uploadCsv($table, $path);
?>