<?php
function TableInsert($table, $data) {
	DBConnect();
	$sql = "INSERT INTO $table (";
	$sql .= implode(", ", array_keys($data));
	$sql .= ") VALUES ('";
	$sql .= implode("', '", sql_escape_array($data));
	$sql .= "');";
	#echo $sql . "<br>";

	logTableChange($sql, json_encode(debug_backtrace()));
	$result = mysql_query($sql);
	if ($result) {
		return true;
	} else {
		return null;
	}
}

function TableInsertSql($table, $data) {
	$sql = "INSERT INTO $table (";
	$sql .= implode(", ", array_keys($data));
	$sql .= ") VALUES ('";
	$sql .= implode("', '", sql_escape_array($data));
	$sql .= "');";
	
	return $sql;
}
?>