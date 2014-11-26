<?php
echo "------------ SETUP STARTED ----------";
require '../common.php';
echo "<br>";
require 'table_create_colleges.php';
require 'table_create_events.php';
require 'table_create_schedule.php';
require 'table_create_schools.php';
require 'table_create_students.php';
require 'table_create_users.php';
require 'table_create_connections.php';
echo "------------ SETUP COMPLETE ----------";
?>