<?php
	require '../backend/common.php';
	lock();
	
	$params = get_params();

	function findInUniverse($universe, $id) {
		foreach($universe as $i) {
			if ($i['id'] == $id) {
				return $i;
				break;
			}
		}
	}

?>