<?php
$table = 'users';

$students = getConnectedStudentsOfLoggedinUser()['data'];

$response = array(
	"success" => "true",
	"students" => $students,
);

?>