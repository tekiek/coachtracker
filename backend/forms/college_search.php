<?php
require '../common.php';
DBConnect();

$table = 'colleges';
$term = trim(strip_tags($_GET['term']));

$qstring = "SELECT name as value, id FROM " . $table . " WHERE name LIKE '%" . $term . "%'";
$result = mysql_query($qstring);

while ($row = mysql_fetch_array($result,MYSQL_ASSOC)) {
		$row['value'] = htmlentities(stripslashes($row['value']));
		$row['id'] = (int)$row['id'];
		$row_set[] = $row;
}
echo json_encode($row_set);
?>