<?php
	$table = "schools";
	$tableConfig = tableSchoolsCols();

	if (TableCreate($table, $tableConfig)) {
		echo "Table Created: $table" . "<br>";
	} else {
		echo "Error creating table: " . mysql_error($con);
	}

	// Insert Data
	// Insert Data
	$path = "data/schools.csv";
	uploadCsv($table, $path);
	// $path = "data/schools.csv";
	// $row = 1;
	// if (($handle = fopen($path, "r")) !== FALSE) {
	// 	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
	// 		$row++;
	// 		$data_entries[] = $data ;
	// 	}
	// 	fclose($handle);
	// }
	// 
	// foreach($data_entries as $line){
	// 	$sql = "INSERT INTO schools (id, name) VALUES ('";
	// 	$sql .= implode("', '", $line);
	// 	$sql .= "');";
	// 
	// 	if (mysql_query($sql)) {
	// 		echo "";
	// 	} else {
	// 		// echo "Error Inserting In: " . $table . "<br>";
	// 		// print_r($line);
	// 		// echo "<br>";
	// 	}
	//     }
	echo "Table Populated: " . $table . "<br>";
?>