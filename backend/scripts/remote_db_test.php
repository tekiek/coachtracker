<?php

	// printf("MySQL host info: %s\n", mysql_get_host_info());
	// echo "<br><br>";
	// echo gethostname();
	$host = "23.229.247.201";
	$db_name = "jerkface";
	$username = "jerkface";
	$password = "Banned123!";
	
	$con = mysql_connect("$host", "$username", "$password") or die("cannot connect");
	mysql_select_db("$db_name") or die("cannot select DB");
	
	echo "WORED!"
?>