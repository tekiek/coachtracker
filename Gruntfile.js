module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
		concat: {
			css_critical: {
				src: [
					"css/critical/bootstrap-critical.css",
					"css/critical/default.css",
					"css/critical/header.css",
					"css/critical/tools.css",
					"css/critical/app.css",
					"css/critical/site_info.css",
					"css/critical/acls.css",
					"css/critical/login.css",
					"css/critical/studentEdit.css",
				],
				dest: 'css/min/critical.css'
			},
			css: {
				src: [
					"css/app/bootstrap-lazy.css",
					"css/app/spinner.css",
					"css/app/menu.css",
					"css/app/animate.css",
					"css/app/jquery.ui.css",
					"css/app/datepicker.css",
					"css/app/signature.css",
					"css/app/studentList.css",
					"css/app/eventAdd.css",
					"css/app/emailBlast.css",
					"css/app/addtohomescreen.css",
					"css/app/jquery.tabletools.css",
					"css/app/table.css",
					"css/app/connection.css",
					"css/app/export.css",
					"css/app/upload.css",
					"css/app/reports.css",
				],
				dest: 'css/min/app.css'
			},
			js: {
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
					
					"js/libs/a/jquery.ui.js",
					
					"js/libs/b/jquery.datepicker.js",
					"js/libs/b/jquery.form.js",
					"js/libs/b/jquery.upload.js",
					"js/libs/b/jquery.inputmask.js",      
					"js/libs/b/jquery.touch.js",
					"js/libs/b/jquery.signature.js",
					"js/libs/b/jquery.scrollintoview.js",
					
					'js/tools/table.js',
					'js/tools/charts.js',
					'js/tools/upload.js',
					'js/tools/export.js',
					'js/tools/connection.js',
					'js/tools/reports.js',
					
					"js/libs/table/data.tables.js",
					"js/libs/table/table.tools.js",
					"js/libs/table/charts.js",
				],
				dest : 'js/min/app.js'
			},	
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
			js: {
				files: {
					'js/min/app.js' : [ 'js/min/app.js' ]
				}
			}
		},
		watch: {
			files: [
				'css/critical/*.css',
				'css/app/*.css', 
				'js/libs/a/*.js',
				'js/app/*.js',
				'js/libs/b/*.js',
				'js/tools/*.js',
				'js/libs/table/*.js',
			],
			tasks: ['concat', 'cssmin']
		},
		'string-replace': {
			dist: {
				files: {
					'backend/common.php': 'backend/common.php',
				},
				options: {
					replacements: [{
						pattern: /version = '([a-z0-9]+).([a-z0-9]+).([a-z0-9]+)'/g,
						replacement: "version = '<%= pkg.version %>'"
					}]
				}
			}
		},
		bumpup: {
			file: 'package.json'
		},
		ftpscript: {
			stage: {
				options: {
					host: 'ftp.coachtracker.org',
					passive: 'on',
					port: 21,
					type: 0,
				},
				files: [{
					expand: true,
					src: [
						'backend/*',
						'backend/db/*',
						'backend/forms/*',
						'backend/includes/*',
						'backend/scripts/*',
						'backend/tools/*',
						'connect/*',
						'css/min/*',
						'export/*',
						'images/**',
						'js/min/*',
						'reports/*',
						'upload/*',
						'index.php',
						'Gruntfile.js',
						'.htaccess',
					],
					dest: '/stage' 
				}]
			},
			prod: {
				options: {
					host: 'ftp.coachtracker.org',
					passive: 'on',
					port: 21,
					type: 0,
				},
				files: [{
					expand: true,
					src: [
						'backend/*',
						'backend/db/*',
						'backend/forms/*',
						'backend/includes/*',
						'backend/scripts/*',
						'backend/tools/*',
						'connect/*',
						'css/min/*',
						'export/*',
						'images/**',
						'js/min/*',
						'reports/*',
						'upload/*',
						'index.php',
						'Gruntfile.js',
						'.htaccess',
					],
					dest: '/' 
				}]
			}
		},
    });

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-bumpup');
	grunt.loadNpmTasks('grunt-string-replace');
	grunt.loadNpmTasks('grunt-ftpscript');
	
	grunt.registerTask('default', [ 
		'concat:css_critical',
		'cssmin:css_critical', 
		'concat:css',
		'cssmin:css',
		'concat:js',
		//'uglify:js',
	]);
	
	grunt.registerTask('deploy:stage', [
		'bumpup:patch',
		'concat:css_critical',
		'cssmin:css_critical', 
		'concat:css',
		'cssmin:css',
		'concat:js', 
		'uglify:js',
		'string-replace',
		'ftpscript:stage'
	]);
	
	grunt.registerTask('deploy:prod', [
		'bumpup:minor',
		'concat:css_critical',
		'cssmin:css_critical', 
		'concat:css',
		'cssmin:css',
		'concat:js', 
		'uglify:js',
		'string-replace',
		'ftpscript:stage'
	]);
};