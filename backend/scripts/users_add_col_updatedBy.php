<?php
	require '../common.php';
	lock();

	$table = 'users';
	$col = 'uploadedBy';

	$result = TableAddCol($table, $col);
	
	if ($result) {
		echo "Table: " . $table . "<br>";
		echo "Action: Add Col " . $col . "<br>";
	} else {
		echo "ERROR!";
	}

	echo "<br>Complete!"
?>