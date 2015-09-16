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
	// JS
	'js-a' => array(
		"//js/libs/a/jquery.js",
		"//js/libs/a/jquery.addons.js",
		"//js/libs/a/jquery.storage.js",
		"//js/libs/a/jquery.blockui.js",
		"//js/libs/a/jquery.template.js",
		"//js/libs/a/event.manager.js",
		'//js/app/app.js',
		"//js/app/timer.js",
		"//js/app/global.js",
		"//js/app/ajax.js",
		"//js/app/header.js",
		"//js/app/gtrack.js",
		"//js/app/controller.js",
		"//js/app/waitForLib.js",
		"//js/app/templates.js",
		//"//js/core/svg.js",
		"//js/app/acl.js",
		"//js/app/login.js",
		"//js/app/menu.js",
		"//js/app/signature.js",
		"//js/app/studentSearch.js",
		"//js/app/studentEdit.js",
		"//js/app/eventAdd.js",
		"//js/app/emailBlast.js",
		"//js/app/fieldController.js",
		"//js/app/fieldsEvent.js",
		"//js/app/fieldsStudent.js",
		"//js/app/fieldsEmailBlast.js",
		"//js/app/email.js",
		'//js/tools/table.js',
		'//js/tools/charts.js',
		'//js/tools/upload.js',
		'//js/tools/export.js',
		'//js/tools/connection.js',
		'//js/tools/reports.js',
	),
	'js-mobile' => array(
		"//js/libs/b/jquery.datepicker.js",
		"//js/libs/a/jquery.ui.js",
		"//js/libs/b/jquery.form.js",
		"//js/libs/b/jquery.upload.js",
		"//js/libs/b/jquery.inputmask.js",      
		"//js/libs/b/jquery.touch.js",
		"//js/libs/b/jquery.signature.js",
		"//js/libs/b/jquery.scrollintoview.js",
		//"//js/libs/b/addtohomescreen.js",
	),
	'js-web' => array(
		"//js/libs/b/jquery.datepicker.js",
		"//js/libs/a/jquery.ui.js",
		"//js/libs/b/jquery.form.js",
		"//js/libs/b/jquery.upload.js",
		"//js/libs/b/jquery.inputmask.js",      
		"//js/libs/b/jquery.touch.js",
		"//js/libs/b/jquery.signature.js",
		"//js/libs/b/jquery.scrollintoview.js",
		"//js/libs/table/data.tables.js",
		"//js/libs/table/table.tools.js",
		"//js/libs/table/charts.js",
	),
	
	
	// CSS
	'css-critical' => array(
		"//css/bootstrap/bootstrap-critical.css",
		//"//css/bootstrap/bootstrap.css",
		"//css/default.css",
		"//css/header.css",
		"//css/tools/tools.css",
		"//css/app/app.css",
		"//css/app/site_info.css",
		"//css/app/acls.css",
		"//css/app/login.css",
		"//css/app/studentEdit.css",
	),
	'css-a' => array(
		"//css/bootstrap/bootstrap-lazy.css",
		//"//css/svg.css",
		"//css/spinner.css",
		"//css/app/menu.css",
		"//css/animate.css",
		"//css/jquery.ui.css",
		"//css/datepicker.css",
		"//css/app/signature.css",
		"//css/app/studentList.css",
		"//css/app/eventAdd.css",
		"//css/app/emailBlast.css",
		"//css/addtohomescreen.css",
		"//css/jquery.tabletools.css",
		"//css/tools/table.css",
		"//css/tools/connection.css",
		"//css/tools/export.css",
		"//css/tools/upload.css",
		"//css/tools/reports.css",
	),
	'css-b' => array(),

);