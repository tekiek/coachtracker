<?php
/**
 * Groups configuration for default Minify implementation
 * @package Minify
 */

/** 
 * You may wish to use the Minify URI Builder app to suggest
 * changes. http://yourdomain/min/builder/
 *
 * See http://code.google.com/p/minify/wiki/CustomSource for other ideas
 **/

return array(
	'jslibs' => array(
		"//js/libs/a/jquery.js",
		"//js/libs/a/jquery.ui.js",
		"//js/libs/a/jquery.addons.js",
		"//js/libs/a/jquery.storage.js",
		"//js/libs/a/jquery.blockui.js",
		"//js/libs/a/jquery.template.js",
		"//js/libs/a/event.manager.js",
		"//js/libs/b/jquery.form.js",
		"//js/libs/b/jquery.upload.js",
		"//js/libs/b/jquery.inputmask.js",      
		"//js/libs/b/jquery.touch.js",
		"//js/libs/b/jquery.signature.js",
		"//js/libs/b/jquery.scrollintoview.js",
		"//js/libs/b/addtohomescreen.js",
	),
	'jsapp' => array(
		"//js/app/app.js",
		"//js/app/ajax.js",
		"//js/app/acl.js",
		"//js/app/menu.js",
		"//js/app/common.js",
		"//js/app/signature.js",
		"//js/app/controller.js",
		"//js/app/header.js",
		"//js/app/studentSearch.js",
		"//js/app/studentEdit.js",
		"//js/app/eventAdd.js",
		"//js/app/fieldController.js",
		"//js/app/fieldsEvent.js",
		"//js/app/fieldsSchedule.js",
		"//js/app/fieldsStudent.js",
		"//js/app/scheduleAdd.js",
		"//js/app/scheduleList.js",
		"//js/app/login.js",
		"//js/app/email.js",
		"//js/app/gtrack.js",
		"//js/app/imageAdd.js",
		"//js/app/online.js",
	),
	'cssapp' => array(
		"//css/app.css",
		"//css/fontawesome.css",
		"//css/bootstrap.css",
		"//css/jquery.ui.css",
		"//css/jquery.signature.css",	
		"//css/addtohomescreen.css",
		"//css/animate.css",
	),
	'jstools' => array(
		'//js/tools/table_filter.js',
		'//js/tools/tools.js',
		'//js/tools/table.js',
		'//js/tools/upload.js',
		'//js/tools/export.js',
		'//js/tools/connection.js',
	),
	'csstools' => array(
		"//css/app.css",
		"//css/fontawesome.css",
		"//css/bootstrap.css",
		"//css/jquery.ui.css",
		"//css/tools.css",
		"//css/jquery.tabletools.css",
	)

);