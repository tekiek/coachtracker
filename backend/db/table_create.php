<?php
function TableCreate($table, $config) {
	DBConnect();
	
	// Delete Table If Exist
	$sql = 'DROP TABLE ' . $table;
	mysql_query($sql);
	
	// Create Table
	$sql = "CREATE TABLE $table (";
	foreach ($config as $col => $rule) {
		$sql .= $col . " " . $rule;
		if (!lastInArray($config, $col)) $sql .= ",";
		else $sql .= ");";
	}
	logTableChange($sql, json_encode(debug_backtrace()));
	$result = mysql_query($sql);
	
	if ($result) {
		return true;
	} else {
		echo "Error creating table: " . mysql_error($con);
		echo "<br>" . $sql;
		return false;
	}
}
?>