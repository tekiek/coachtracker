module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		concat: {
			css_critical: {
				src: [
					"css/bootstrap/bootstrap-critical.css",
					"css/default.css",
					"css/header.css",
					"css/tools/tools.css",
					"css/app/app.css",
					"css/app/site_info.css",
					"css/app/acls.css",
					"css/app/login.css",
					"css/app/studentEdit.css",
				],
				dest: 'css/min/critical.css'
			},
			css: {
				src: [
					"css/bootstrap/bootstrap-lazy.css",
					"css/spinner.css",
					"css/app/menu.css",
					"css/animate.css",
					"css/jquery.ui.css",
					"css/datepicker.css",
					"css/app/signature.css",
					"css/app/studentList.css",
					"css/app/eventAdd.css",
					"css/app/emailBlast.css",
					"css/addtohomescreen.css",
					"css/jquery.tabletools.css",
					"css/tools/table.css",
					"css/tools/connection.css",
					"css/tools/export.css",
					"css/tools/upload.css",
					"css/tools/reports.css",
				],
				dest: 'css/min/app.css'
			},
			js_mobile : {
				src : [
					"js/libs/a/jquery.js",
					"js/libs/a/jquery.addons.js",
					"js/libs/a/jquery.storage.js",
					"js/libs/a/jquery.blockui.js",
					"js/libs/a/jquery.template.js",
					"js/libs/a/event.manager.js",
					'js/app/app.js',
					"js/app/timer.js",
					"js/app/global.js",
					"js/app/ajax.js",
					"js/app/header.js",
					"js/app/gtrack.js",
					"js/app/controller.js",
					"js/app/waitForLib.js",
					"js/app/templates.js",
					"js/app/acl.js",
					"js/app/login.js",
					"js/app/menu.js",
					"js/app/signature.js",
					"js/app/studentSearch.js",
					"js/app/studentEdit.js",
					"js/app/eventAdd.js",
					"js/app/emailBlast.js",
					"js/app/fieldController.js",
					"js/app/fieldsEvent.js",
					"js/app/fieldsStudent.js",
					"js/app/fieldsEmailBlast.js",
					"js/app/email.js",

					"js/libs/b/jquery.datepicker.js",
					"js/libs/a/jquery.ui.js",
					"js/libs/b/jquery.form.js",
					"js/libs/b/jquery.upload.js",
					"js/libs/b/jquery.inputmask.js",      
					"js/libs/b/jquery.touch.js",
					"js/libs/b/jquery.signature.js",
					"js/libs/b/jquery.scrollintoview.js",
				],
				dest : 'js/min/mobile.js'
			},
			js_desktop : {
				src : [
					"js/libs/a/jquery.js",
					"js/libs/a/jquery.addons.js",
					"js/libs/a/jquery.storage.js",
					"js/libs/a/jquery.blockui.js",
					"js/libs/a/jquery.template.js",
					"js/libs/a/event.manager.js",
					'js/app/app.js',
					"js/app/timer.js",
					"js/app/global.js",
					"js/app/ajax.js",
					"js/app/header.js",
					"js/app/gtrack.js",
					"js/app/controller.js",
					"js/app/waitForLib.js",
					"js/app/templates.js",
					"js/app/acl.js",
					"js/app/login.js",
					"js/app/menu.js",
					"js/app/signature.js",
					"js/app/studentSearch.js",
					"js/app/studentEdit.js",
					"js/app/eventAdd.js",
					"js/app/emailBlast.js",
					"js/app/fieldController.js",
					"js/app/fieldsEvent.js",
					"js/app/fieldsStudent.js",
					"js/app/fieldsEmailBlast.js",
					"js/app/email.js",
					'js/tools/table.js',
					'js/tools/charts.js',
					'js/tools/upload.js',
					'js/tools/export.js',
					'js/tools/connection.js',
					'js/tools/reports.js',
					"js/libs/b/jquery.datepicker.js",
					"js/libs/a/jquery.ui.js",
					"js/libs/b/jquery.form.js",
					"js/libs/b/jquery.upload.js",
					"js/libs/b/jquery.inputmask.js",      
					"js/libs/b/jquery.touch.js",
					"js/libs/b/jquery.signature.js",
					"js/libs/b/jquery.scrollintoview.js",
					"js/libs/table/data.tables.js",
					"js/libs/table/table.tools.js",
					"js/libs/table/charts.js",
				],
				dest : 'js/min/desktop.js'
			}
		},
		cssmin: {
			css_critical:{
 				src: 'css/min/critical.css',
				dest: 'css/min/critical.min.css'
			},
			css:{
 				src: 'css/min/app.css',
				dest: 'css/min/app.min.css'
			}
		},
		uglify : {
			js_mobile: {
				files: {
					'js/min/mobile.js' : [ 'js/min/mobile.js' ]
				}
			},
			js_desktop: {
				files: {
					'js/min/desktop.js' : [ 'js/min/desktop.js' ]
				}
			}
		},
		watch: {
			files: ['css/**/*.css', 'js/**/*.js'],
			tasks: ['concat', 'cssmin']
		},
    });

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
	grunt.registerTask('default', [ 
		'concat:css_critical',
		'cssmin:css_critical', 
		'concat:css',
		'cssmin:css',
		'concat:js_mobile', 
		//'uglify:js_mobile',
		'concat:js_desktop', 
		//'uglify:js_desktop',
	]);
};