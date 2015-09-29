<?php
	require '../common.php';
	lock();
	
	// Redefine time stample column
	$table = 'events';
	$col = 'timestamp';

	$result = TableModifyCol($table, $col);
	
	if ($result) {
		echo "Table: " . $table . "<br>";
		echo "Action: Modify Col " . $col . "<br>";
	} else {
		echo "ERROR!";
	}
	
	// Add dateInserted column
	$table = 'events';
	$col = 'dateInserted';
	
	$result = TableAddCol($table, $col);
	
	if ($result) {
		echo "Table: " . $table . "<br>";
		echo "Action: Add Col " . $col . "<br>";
	} else {
		echo "ERROR!";
	}
	echo "<br>Complete!"
?>