<?php
require '../common.php';

$schedule_table = TableData('schedule', get_params());
$schedules = array();

while ($row = mysql_fetch_assoc($schedule_table)) {
	if (strtotime($row['meetingTime']) > time()) {
		$schedule = array();
		$student = TableRow('students', array("id" => $row['studentid']));

		foreach($row as $column => $value) {
			$schedule[$column] = $value;
		}

		array_push($schedules, array(
			'student' => $student,
			'schedule' => $schedule
		));
	}
}

echo json_encode($schedules);

?>