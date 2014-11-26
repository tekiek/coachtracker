<?php
	function getTableColsByName($table) {
		if ($table == 'users') return tableUsersCols();
		if ($table == 'students') return tableStudentsCols();
		if ($table == 'events') return tableEventsCols();
		if ($table == 'schedule') return tableScheduleCols();
		if ($table == 'colleges') return tableCollegesCols();
		if ($table == 'schools') return tableSchoolsCols();
		if ($table == 'connection') return tableConnections();
	}

	function tableUsersCols() {
		$users = array(
			'id' 			=> 'INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id)',
			'createdTime' 	=> 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
			'name' 			=> 'varchar(255)',
			'email' 		=> 'varchar(255) UNIQUE',
			'coach'			=> 'BOOLEAN',
			'counselor'		=> 'BOOLEAN',
			'captain'		=> 'BOOLEAN',
			'admin'			=> 'BOOLEAN',
			'password' 		=> 'varchar(255) DEFAULT "cuny"',
			'pwReset' 		=> 'BOOLEAN DEFAULT 0',
		);
		return $users;
	}

	function tableStudentsCols() {
		$students = array(
			'id' 			=> 'INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id)',
			'dbId'			=> 'varchar(255)',
			'cbo'			=> 'varchar(255)',
			'dob'			=> 'varchar(255)',
			'fname' 		=> 'varchar(255)',
			'lname' 		=> 'varchar(255)',
			'email' 		=> 'varchar(255)',
			'phone' 		=> 'varchar(255)',
			'contact'		=> 'varchar(255)',
			'school' 		=> 'varchar(255)',
			'college' 		=> 'varchar(255)',
			'major' 		=> 'varchar(255)',
			'userImg' 		=> 'varchar(255) NOT NULL DEFAULT "default.jpg"',
			'notes' 		=> 'varchar(255)',
			'createdTime' 	=> 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
		);
		return $students;
	}

	function tableConnections() {
		$connection = array(
			'id' 			=> 'INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id)',
			'createdTime' 	=> 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
			'createdUser'	=> 'INT', // id of logged-in user
			'type' 			=> 'varchar(255)', // student or user
			'userid' 		=> 'INT',
			'connectionid' 	=> 'INT',
		);
		return $connection;
	}

	function tableEventsCols() {
		$events = array(
			'id' 		=> 'INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id)',
			'userid' 	=> 'INT',
			'studentid' => 'INT',
			'location' 	=> 'varchar(255)',
			'duration' 	=> 'varchar(255)',
			'reason' 	=> 'varchar(255)',
			'notes' 	=> 'varchar(255)',
			'signature' => 'LONGTEXT',
			'timestamp' => 'DATE'
		);
		return $events;
	}

	function tableScheduleCols() {
		$schedule = array(
			'id' 				=> 'INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id)',
			'createdTime' 		=> 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
			'userid' 			=> 'INT',
			'studentid' 		=> 'INT',
			'meetingTime' 		=> 'TIMESTAMP',
			'meetingReason' 	=> 'LONGTEXT',
			'reminderType' 		=> 'varchar(255)',
			'reminderTime' 		=> 'TIMESTAMP',
			'reminderMsg' 		=> 'LONGTEXT',
			'reminderExecuted' 	=> 'BOOL'
		);
		return $schedule;
	}

	function tableCollegesCols() {
		$colleges = array(
			'id' 	=> 'INT NOT NULL, PRIMARY KEY(id)',
			'name' 	=> 'CHAR(255)',
			'city' 	=> 'CHAR(255)',
			'state' => 'CHAR(255)'
		);
		return $colleges;
	}

	function tableSchoolsCols() {
		$schools = array(
			'id' 	=> 'CHAR(255) NOT NULL, PRIMARY KEY(id)',
			'name' 	=> 'CHAR(255)'
		);
		return $schools;
	}

?>