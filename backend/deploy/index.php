<?php
require '../common.php';
echo "<b>Deploy Setup: STARTED</b>";
echo "<br>---------------------<br>";
require 'combine_externals.php';
echo "<br>";
require 'create_manifest.php';
echo "<br>---------------------<br>";
echo "<br><b>Deploy Setup: ENDED</b>";


?>