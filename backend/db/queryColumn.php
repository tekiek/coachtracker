<?php

function queryColumn($sql) {
	$columns = array();
	
	// Get table data
	DBConnect();
	$result = mysql_query($sql);
	logTableChange($sql, json_encode(debug_backtrace()));

	//Create array from column data
	if (mysql_num_rows($result) > 0) {
		while ($row = mysql_fetch_assoc($result)) {
			foreach($row as $column => $value) {
				array_push($columns, $value);
			}
		}                                                                             
	}
	mysql_free_result($result);
	
	return $columns;
}

?>