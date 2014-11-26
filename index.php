<html>
	<head>
		<title>Coach Tracker</title>
		<?php require 'backend/common.php';  ?>
		<meta id="Viewport" name="viewport" width="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=yes, width=320">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="mobile-web-app-capable" content="yes">
		<link rel="icon" type="image/png" href="images/icons/favicon.png">
		<link rel="apple-touch-icon-precomposed" sizes="57x57" href="images/icons/apple-icon-57x57-precomposed.png" />
		<link rel="apple-touch-icon-precomposed" sizes="144x144" href="images/icons/apple-icon-144x144-precomposed.png" />
		<?php LoadCSS($CSSApp); ?>                                  
	</head>                                   
	<body>
		
		<header data-category="header">
			<div id="header-fields"></div>
		</header>
	
		<div id="sub-content">
			<div data-category="event-signature" id="event-signature"></div>
		</div>
	
		<div id='content' class="acl-loggedin">
			<div data-category="schedule-list" id="schedule-list" class="c"></div>
			<div data-category="home-screen" id="home-screen" class="c"></div>
			<div data-category="user-edit" id='user-edit' class="c"></div>
			<div data-category="user-list" id="user-list" class="c"></div>
			<div data-category="user-search" id="user-search" class="c"></div>
			<div data-category="student-edit" id="user-screen" class="c"></div>
			<div data-category="event-add" id="event-add" class="c"></div>
			<div data-category="event-list" id="event-list" class="c"></div>
			<div data-category="schedule-add" id="schedule-add" class="c"></div>
			<div data-category="schedule-list" id="schedule-list" class="c"></div>
		</div>

		<div id="alert"></div>
		<div id="spinner"></div>
		<div id="dialog"></div>

		<?php LoadJS($JSLibsA); ?>
		<?php LoadJS($JSApp); ?>
		<?php LoadJS($JSLibsB);  ?> 
		<?php ga_lib(); ?>
	</body>                                                                 
</html>