<?php
	$table = "colleges";
	$tableConfig = tableCollegesCols();

	if (TableCreate($table, $tableConfig)) {
		echo "Table Created: $table" . "<br>";
	} else {
		echo "Error creating table: " . mysql_error($con);
	}

	// Insert Data
	$path = "data/colleges.csv";
	uploadCsv($table, $path);

	echo "Table Populated: " . $table . "<br>";
?>