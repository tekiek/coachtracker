<?php

function TableRow($table, $data) {
	$sql = "SELECT * FROM $table";
	if ($data) { 
		$sql .= " WHERE "; 
		foreach ($data as $key => $value) {
			 $sql .= $key . "='" . $value . "' ";
			if ($key != end(array_keys($data))) { $sql .= " and "; }
		}
	}
	
	DBConnect();
	$table_data = mysql_query($sql);
	
	if ($table_data) {
		$result = array();
		while ($row = mysql_fetch_assoc($table_data)) {
			foreach($row as $column => $value) {
				$result[$column] = $value;
			}
			return $result;
		}
	} else {
		return null;
	}
}
?>