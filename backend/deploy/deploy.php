<?php
require '../common.php';
DBConnect();

// Add contact to students table
$table = 'students';
$col = 'contact';
$sql = "ALTER TABLE " . $table . " ADD " . $col . " varchar(255) AFTER phone;";
$result = mysql_query($sql);
echo "Added col: '" . $col . "' to table: '" . $table . "'.";

// Add Schedule Table
// NEED TO ADD!
//header('Location: http://www.yoursite.com/new_page.html') ;

?>