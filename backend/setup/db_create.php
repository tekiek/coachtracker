<?php
	require '../common.php';
	$con = mysqli_connect("$db_host", "$db_username", "$db_password");

	// Check connection
	if (mysqli_connect_errno()) {
		echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	// Create database
	$sql = "CREATE DATABASE $db_name";
	if (mysqli_query($con, $sql)) {
		echo "Database my_db created successfully";
	} else {
		echo "Error creating database: " . mysqli_error($con);
	}
?>