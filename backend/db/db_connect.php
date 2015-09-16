<?php
function DBConnect($env) {
	if (!$env) $env = env();
	
	if ($env == 'prod') {
		$host = "localhost";
		$db_name = "jerkface";
		$username = "jerkface";
		$password = "Banned123!";
	} 
	else if ($env == 'stage') {
		$host = "localhost";
		$db_name = "stage_jerkface";
		$username = "jerkface";
		$password = "Banned123!";
	}
	else {
		$host = "localhost";
		$db_name = "jerkface";
		$username = "root";
		$password = "root";
	}

	$con = mysql_connect("$host", "$username", "$password") or die("cannot connect");
	mysql_select_db("$db_name") or die("cannot select DB");
	return $con;
}
?>