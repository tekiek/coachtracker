<?php

session_start();

require 'db/table_config.php';
require 'db/db_connect.php';
require 'db/table_insert.php';
require 'db/table_data.php';
require 'db/table_row.php';
require 'db/table_count.php';
require 'db/table_update.php';
require 'db/table_create.php';
require 'db/table_delete.php';
require 'db/table_add_col.php';
require 'db/table_modify_col.php';
require 'includes/dirs.php';
require 'includes/helpers.php';
require 'includes/elements.php';
require 'includes/svgs.php';
require 'includes/users.php';
require 'includes/connections.php';
require 'includes/studentConnections.php';
require 'includes/userConnections.php';
require 'includes/eventConnections.php';
require 'includes/simpleImage.php';
require 'db/queryTable.php';
require 'db/queryColumn.php';

$version = '2.00.0';
if (env() == 'dev') $version = rand(1, 9999);
?>