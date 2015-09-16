<?php

// $api_url = "http://stage.coachtracker.org/backend/remote/remote.php";
// $response = file_get_contents($api_url);
// echo $response;

$host = "localhost";
$db_name = "stage_jerkface";
$username = "jerkface";
$password = "Banned123!";

$con = mysql_connect("$host", "$username", "$password") or die("cannot connect");
mysql_select_db("$db_name") or die("cannot select DB");



?>