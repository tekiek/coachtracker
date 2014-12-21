<?php
function TableDelete($table, $ORs, $ANDs) {
	DBConnect();
	
	$sql = "DELETE FROM $table WHERE ";
	
	// ORs
	if ($ORs) {
		foreach($ORs as $key => $OR) {
			foreach($OR as $col => $value) {
				$sql .= $col . "='" . $value . "'";
				if (!lastInArray($OR, $col)) $sql .= " OR ";
			}
			if (!lastInArray($ORs, $key)) $sql .= " OR ";
		}
	}
	
	// ANDs
	if ($ANDs) {
		$sql .= " AND ";
		foreach($ANDs as $key => $AND) {
			foreach($AND as $col => $value) {
				$sql .= $col . "='" . $value . "'";
				if (!lastInArray($AND, $col)) $sql .= " AND ";
			}
			if (!lastInArray($ANDs, $key)) $sql .= " AND ";
		}
	}
	$sql .= ";";
	logTableChange($sql, json_encode(debug_backtrace()));
	$result = mysql_query($sql);
	if ($result) {
		return true;
	} else {
		return null;
	}
}
?>