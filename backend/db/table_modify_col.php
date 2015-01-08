<?php

function TableModifyCol($table, $col) {
	$tableCols = getTableColsByName($table);
	$colDetails = $tableCols[$col];
	
	$sql = "ALTER TABLE $table ";
	$sql .= "MODIFY COLUMN $col $colDetails ";

	DBConnect();
	logTableChange($sql, json_encode(debug_backtrace()));
	return mysql_query($sql);
}
?>