<?php

function queryTable($sql) {
	$table = array();
	
	// Get table data
	DBConnect();
	$result = mysql_query($sql);
	logTableChange($sql, json_encode(debug_backtrace()));

	//Create data array
	if (mysql_num_rows($result) > 0) {
		$i = 0;
		while($table[$i] = mysql_fetch_assoc($result)) 
			$i++;
		unset($table[$i]);                                                                                  
	}
	mysql_free_result($result);
	
	return $table;
}

?>