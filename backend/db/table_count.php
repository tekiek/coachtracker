<?php

function TableCount($table, $data) {
	$result = TableData($table, $data);

	if ($result) {
		return mysql_num_rows($result);
	} else {
		return 0;
	}
	
}
?>