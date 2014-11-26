<?php
	$table = "students";
	$tableConfig = tableStudentsCols();

	if (TableCreate($table, $tableConfig)) {
		echo "Table Created: $table" . "<br>";
	} else {
		echo "Error creating table: " . mysql_error($con);
	}
	
	// Insert Data
	$path = "data/students.csv";
	uploadCsv($table, $path);
?>