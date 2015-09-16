app['studentSearch'] = new function() {
	var _studentSearch = this,
		selectedStudent;

	this.data;
	this.els = {};

	this.templates = {
		'searchWrapper'	: '<div data-category="student-search" class="search-wrapper"></div>',
		'searchField'	: '<div class="input-group input-group-lg"></div>',
		'iconWrapper'	: '<span class="input-group-addon"></span>'
	};

	this.template_data = {
		'dirIcon': {
			'icon'			: 'angle-right',
			'classes'		: 'fa-2x right dirIcon'
		},
		'iconSearch': {
			'icon'			: 'search',
			'classes'		: 'fa-2x'
		},
		'iconCancel': {
			'icon'			: 'times-circle',
			'classes'		: 'fa-2x'
		},
		'iconUser': {
			'icon'			: 'user',
			'classes'		: 'fa-2x'
		},
		'inputSearch': {
			'type'			:'input',
			'inputType'		:'text',
			'placeholder'	:'Search for user',
			'mask'			: null,
			'gtAct'			:'search-field'
		},
	};
	
	this.init = function() {
		app.libs.waitForLib({
			lib: 'jqueryui',
			cb: _studentSearch.waitForStudents
		});
	}
	
	this.waitForStudents = function() {
		if (_login.hasConnectedStudents()) {
			_studentSearch.getEls();
			_studentSearch.addStudentSearch();
		} else {
			setTimeout(function() {
				_studentSearch.init();
			}, 250)
		}
	}
	
	/*
	 * init
	 */
	this.addStudentSearch = function() {
		_studentSearch.buildSearchUI();
		_studentSearch.buildStudentList();
		_studentSearch.searchUser();
	}
	
	this.getEls = function() {
		_studentSearch.els['parent'] = $('#student-search');
	}

	/*
	 * build search ui
	 */
	this.buildSearchUI = function() {
		var searchWrapper = $.tmpl(_studentSearch.templates.searchWrapper, {})
			searchField = $.tmpl(_studentSearch.templates.searchField, {})
			iconWrapper = $.tmpl(_studentSearch.templates.iconWrapper, {})
			iconSearch = $.tmpl(app.templates.svg, _studentSearch.template_data['iconSearch']),
			iconCancel = $.tmpl(app.templates.svg, _studentSearch.template_data['iconCancel']),
			iconUser = $.tmpl(app.templates.svg, _studentSearch.template_data['iconUser']),
			inputSearch = app.fieldController.createField(_studentSearch.template_data['inputSearch']);

		$(iconWrapper)
			.append(iconSearch)
			.append(iconCancel)
			.append(iconUser);

		$(searchField)
			.append(iconWrapper)
			.append(inputSearch);
			
		$(searchWrapper)
			.append(searchField);

		_studentSearch.els['searchWrapper'] 	= $(searchWrapper);
		_studentSearch.els['inputSearch'] 		= $(inputSearch);
		_studentSearch.els['iconSearch'] 		= $(iconSearch);
		_studentSearch.els['iconCancel'] 		= $(iconCancel);
		_studentSearch.els['iconUser'] 			= $(iconUser);

		app.header.addSearch(_studentSearch.els['searchWrapper']);
		_studentSearch.els['inputSearch'].focus();
	}
	
	/*
	 * Get students list in Alpha order
	 */
	this.getStudentsSorted = function() {
		var students = app.data.user.students;

		students.sort(function(a, b) {
			var aName = a.fname.toLowerCase(),
				bName = b.fname.toLowerCase();
			return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
		});
		return students;
	}

	/*
	 * Create Student List
	 */
	this.buildStudentList = function() {
		var studentListEL = $.tmpl(app.templates.listGroup, {
				'classes': 'studentList'
			}),
			students = _studentSearch.getStudentsSorted();

		_studentSearch.els['studentListEL'] = studentListEL;

		$.each(students, function(i, student) {
			if (student.id && student.fname && student.lname) {
				var studentEl = $.tmpl(app.templates.listItem),
					studentDetails = ['email', 'phone'],
					name = $.tmpl(app.templates.h3, {
						'text': student.fname + ' ' + student.lname
					}),
					dirIcon = $.tmpl(app.templates.svg, _studentSearch.template_data['dirIcon']);

				// Add UI
				studentEl
					.attr('data-id', student.id)
					.append(dirIcon)
					.append(name);

				$.each(studentDetails, function(x, detail) {
					if (student[detail]) {
						var detailEl = $.tmpl(app.templates.div, {
							'input': student[detail],
							'classes': 'student-info'
						});
						studentEl.append(detailEl)
					}
				});
				studentListEL.append(studentEl);

				// Add Events
				studentEl.click({
					'studentEl'	: studentEl,
					'student'	: student
				}, _studentSearch.studentSelect);
			}
			
		});
		// _studentSearch.els.parent
		// 	.append(studentListEL)
		// 	.show();
		_studentSearch.els['studentListEL'] = studentListEL;
		_controller.currSlide().els.parent.append(studentListEL);
	}

	/*
	 * Student element selected
	 * params:
	 * - studentEl (element)
	 * - student (object)
	 */
	this.studentSelect = function(params) {
		if (!params || !params.data) return false;
		var data = params.data,
			studentEl = data.studentEl,
			student = data.student;

		// Hide all other students
		_studentSearch.toggleSearchResults({
			'visibleIds':  [student.id]
		});
		
		setTimeout(function() {
			// Textbox animation
			_studentSearch.els['inputSearch'].val(student.fname + ' ' + student.lname);
			_studentSearch.searchIcon('user');
			app.global.animate(_studentSearch.els['inputSearch'], 'pulse', 'default');
		
			// Student Animation
			// app.global.animate(studentEl, 'bounceOutUp', 'default', function() {
				// studentEl.hide();
				// _studentSearch.getUserData({
				// 	'id': student.id
				// });
			// });
			
			studentEl.hide();
			_studentSearch.getUserData({
				'id': student.id
			});
		}, 250);
		
		app.gtrack.track_event('app:student-search', 'click:student-click');
	}
	
	/*
	 * toggle search icon
	 * params:
	 * - s (string) search | clear
	 */
	this.searchIcon = function(s) {
		_studentSearch.els['iconSearch'].toggle(s == 'search' ? true : false);
		_studentSearch.els['iconCancel'].toggle(s == 'clear' ? true : false);
		_studentSearch.els['iconUser'].toggle(s == 'user' ? true : false);
	}
	
	/*
	 * Format Search Data
	 * params:
	 * - students (array)
	 * response:
	 * - label (string) name
	 * - value (int) studentid
	 */
	this.createSearchData = function(data) {
		var response = new Array();
		
		$.each(data, function(i, entry) {
			if (entry['id'] && entry['fname'] && entry['lname']) {
				response.push({
					value: entry['id'],
					label: entry['fname'] + " " + entry['lname']
				});
			}
		});

		return response;
	}

	/*
	 * Create search autocomplete
	 */
	this.searchUser = function() {
		var students = _studentSearch.createSearchData(app.data.user.students);

		_studentSearch.els['inputSearch']
			.keyup(function(e) {
				var key = e.keyCode,
					searchLength = $(this).val().length;

				if (searchLength > 0) {
					_studentSearch.searchIcon('clear');
				}
				else {
					_studentSearch.toggleSearchResults({
						'reset':  true
					});
					_studentSearch.searchIcon('search');
				}	
			})
			.autocomplete({
				minLength: 1,
				source: students,
				delay: 250,
				response: function(e, u) {
					if (u.content) {
						var IDs = $.map(u.content, function(c, i) {
							return c.value;
						});
						_studentSearch.toggleSearchResults({
							'visibleIds':  IDs
						});
					}
					_studentSearch.els['inputSearch'].autocomplete('close');
				}
			});

		// Add Click Events
		_studentSearch.els['iconCancel'].click(function() {
			_studentSearch.searchIcon('search');
			_studentSearch.els['inputSearch']
				.val('')
				.trigger('keyup');
		});

		// Show UI
		_studentSearch.searchIcon('search');
		_studentSearch.els['searchWrapper'].show();
	}

	/*
	 * toggle student list
	 * params:
	 * - reset (boolean) clear search results
	 * - visibleIds (array) list of ids of search results
	 */
	this.toggleSearchResults = function(params) {
		if (!params) params = {};
		if (!params.reset) params.reset = false;
		if (!params.visibleIds) params.visibleIds = [];
		
		var visibleStudentEls = _studentSearch.els['studentListEL'].find('.list-group-item:visible'),
			visibleIds = params.visibleIds;

		if (params.reset) { 
			// Show all search elements
			var studentEls = _studentSearch.els['studentListEL'].find('.list-group-item');
			$(studentEls).show();
		} 
		else if (visibleIds.length > visibleStudentEls.length) {
			// Back space - show hidden searches 
			var hiddenStudentEls = _studentSearch.els['studentListEL'].find('.list-group-item:hidden')
			$.each(hiddenStudentEls, function(i, studentEl) {
				var studentId = $(studentEl).attr('data-id');
				if ($.inArray(studentId, visibleIds) >= 0) {
					$(studentEl).show();
				}
			})
		}
		else {
			// Hide search elements based upon search results
			if (visibleStudentEls.length > 0 && visibleIds.length != visibleStudentEls.length) {
				$.each(visibleStudentEls, function(i, studentEl) {
					var studentId = $(studentEl).attr('data-id');
					if ($.inArray(studentId, visibleIds) == -1) {
						$(studentEl).hide();
					}
				});
				app.gtrack.track_event('app:student-search', 'updated-search-results');
			}
		}
	}
	
	/*
	 * return selected user
	 * params:
	 * - el (el) student element
	 * - id (int) student id
	 */
	this.getUserData = function(params) {
		var students = app.data.user.students,
			studentId = params['id'];

		$.each(students, function(x, student) {
			if (studentId == student['id']) {
				_studentSearch.destroy();
				_studentSearch.selectedStudent = student;
				if (_controller.currSlide()['userSelected']) _controller.currSlide()['userSelected']();
				return false;
			}
		})
	}
	
	this.destroy = function() {
		_studentSearch.els['inputSearch']
			.autocomplete('destroy')
			.attr("disabled", "disabled");
		//_studentSearch.els.parent.hide();
		_studentSearch.els['studentListEL'].remove();
	}
};