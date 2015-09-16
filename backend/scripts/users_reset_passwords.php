<?php

function reset_password($params) {
	
}

	require '../common.php';
	lock();
	$table = 'users';
	$pwRegex = "/^(?=.*[0-9]).{5}/i";
	$updateCount = 0;
	
	// Get all users
	$table_data = TableData($table, array());
	$rows = table_to_array($table_data);
	
	foreach($rows as $row) {
		$password = $row['password'];
		$validPW = preg_match($pwRegex,$password);
		
		if (!$validPW && $row['pwReset'] == 1) {
			$match = array(
				'id' => $row['id']
			);
			$update = array(
				'pwReset' => 0
			);
			TableUpdate($table, $match, $update);
			$updateCount += 1;
		}
	}
	echo "Updated " . $updateCount . " Rows.";
	echo "<br><br>";
	echo "Update complete!";
?>