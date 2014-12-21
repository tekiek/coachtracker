<?php
function TableUpdate($table, $key, $data) {
	$sql = "UPDATE $table SET ";
	
	// Update key='value'
	foreach ($data as $col => $value) {
		$value = "'$value'";
		$updates[] = "$col = $value";
	}
	$sql .= implode(', ', $updates);

	// Where key='value'
	foreach ($key as $col => $value) {
		$value = "'$value'";
		$where[] = "$col = $value";
	}
	$sql .= ' WHERE ';
	$sql .= implode(', ', $where);
	$sql .= ";";

	DBConnect();
	logTableChange($sql, json_encode(debug_backtrace()));
	return mysql_query($sql);
}
?>