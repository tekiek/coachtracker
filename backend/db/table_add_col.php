<?php

function TableAddCol($table, $col) {
	$tableCols = getTableColsByName($table);
	$colDetails = $tableCols[$col];
	
	$sql = "ALTER TABLE $table ";
	$sql .= "ADD $col $colDetails ";

	DBConnect();
	logTableChange($sql, json_encode(debug_backtrace()));
	return mysql_query($sql);
}
?>