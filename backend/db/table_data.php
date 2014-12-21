<?php

function TableData($table, $data, $orderBy) {
	$sql = "SELECT * FROM $table";

	if ($data) { 
		$sql .= " WHERE "; 
		foreach ($data as $key => $value) {
			 $sql .= $key . "='" . $value . "' ";
			if ($key != end(array_keys($data))) { $sql .= " and "; }
		}
	}
	
	if ($orderBy) {
		$sql .= " ORDER BY " . $orderBy;
	}
	
	DBConnect();
	logTableChange($sql, json_encode(debug_backtrace()));
	$result = mysql_query($sql);
	
	if ($result) {
		return $result;
	} else {
		return null;
	}
	
}
?>