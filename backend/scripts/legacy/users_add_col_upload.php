<?php
	require '../common.php';
	lock();
	$table = 'users';
	$col = 'upload';
	
	// Add connect col
	TableAddCol($table, $col);
	
	echo "Table: " . $table . "<br>";
	echo "Action: Add Col " . $col . "<br>";
	
	// Update past data
	
	// Get all users
	$table_data = TableData($table, array());
	$rows = table_to_array($table_data);
	
	foreach($rows as $row) {
		if ($row['admin'] == '1') {
			$match = array(
				'id' => $row['id']
			);
			$update = array(
				$col => 1
			);
			TableUpdate($table, $match, $update);
			echo "Updated: " . $row['id'];
			echo "<br>";
		}
	}
	echo "Update complete!";
?>