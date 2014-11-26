<?php
require '../common.php';
DBConnect();

$table = 'students';
$term = trim(strip_tags($_GET['term']));
$response = array();


if (strlen($term) >= 0) {
	$qstring = "SELECT CONCAT(fname, ' ', lname) as value, id FROM students WHERE CONCAT(fname, ' ', lname) LIKE '%".$term."%' LIMIT 5";
	$result = mysql_query($qstring);

	if ($result) {
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {
			$row['value'] = htmlentities(stripslashes($row['value']));
			$row['id'] = (int)$row['id'];
			$response[] = $row;
		}
	}
}

echo json_encode($response);
?>