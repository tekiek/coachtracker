app['eventAdd'] = new function() {
	_eventAdd = this;
	this.schools;
	this.data = {};
	this.els = {};
	this.apis = {
		'saveEvent': 'backend/_services.php?service=eventAdd',
		'followConnections': 'backend/_services.php?service=eventFollowupConnections',
		'followup': 'backend/_services.php?service=followup'
	}
	
	this.template_data = {
		'signatureBtn': {
			'color'			: 'btn-primary',
			'btnSize'		: 'btn-lg',
			'icon'			: 'pencil',
			'xiconSize'		: 'fa-lg',
			'text'			: 'ADD SIGNATURE',
			'classes'		: 'marginBottom marginTop'
		},
		'saveEvent': {
			'color'			: 'btn-success',
			'btnSize'		: 'btn-lg',
			'icon'			: 'check-circle',
			'iconSize'		: 'fa-lg',
			'text'			: 'SAVE!',
			'classes'		: 'marginBottom10 marginTop saveBtn'
		}
	}
	
	this.init = function() {
		_eventAdd.getEls();
		_eventAdd.setupHeader();
	}
	
	this.getEls = function() {
		_eventAdd.els = {
			parent: $('div#event-add')
		}
	}

	this.setupHeader = function() {
		app.header.addBackButton();
		app.header.addUserField();
		app.studentSearch.init();
	}
	
	this.userSelected = function() {
		//_eventAdd.addStudentImage();
		_eventAdd.addFields();
		_eventAdd.getSignatureBtn();
		_eventAdd.addSaveBtn();
	}
	
	this.addStudentImage = function() {
		app.imageAdd.addUserImage({
			user: app.studentSearch.selectedStudent,
			appendTo: _eventAdd.els['parent']
		});
	}

	this.addFields = function() {
		var eventFieldData = app['fieldController'].getFields(app['fieldsEvent']);
		
		$.each(eventFieldData, function(key, field) {
			var fieldWrapper = $.tmpl(app.templates.field_wrapper, field),
				fieldEl = app.fieldController.createField(field);
				_eventAdd.els[key] = new Object();

			// Add to Dom
			fieldWrapper.append(fieldEl);
			_eventAdd.els['parent'].append(fieldWrapper);

			// Store Els
			_eventAdd.els[key]['wrapper'] = $(fieldWrapper);
			_eventAdd.els[key]['field'] = $(fieldEl);
		});

		// Set default time
		app.eventAdd.els['duration']['field'].val('20');
	}
	
	this.validateFields = function() {
		var fields = $('[data-valid]');
		return app.fieldController.validateFields(fields);
	}

	/*
	 * Add option to location select
	 * params:
	 * - option (string)
	 */
	this.addLocationOption = function(params) {
		var optionEl = $.tmpl(app.templates['option'], {
			'key'	: params['option'],
			'value'	: params['option']
		});
		_eventAdd.els.location.field.append(optionEl);
		_eventAdd.els.location.field.val(params['option']);
		app.global.dialogClose();
	}
	
	this.getSignatureBtn = function() {
		var signatureBtn = $.tmpl(app.templates['button'], _eventAdd.template_data['signatureBtn']);
		
		// Add to DOM
		_eventAdd.els['parent']
			.append(signatureBtn);
		_eventAdd.els['signatureBtn'] = signatureBtn;

		// Add Events
		$(signatureBtn).click(function() {
			app.signature.init();
		});
		EventManager.observe('signature.complete', _eventAdd.returnSignature);
	}
	
	this.returnSignature = function(imgSignature) {
		if (_eventAdd.els['imgSignature']) {
			$(_eventAdd.els['imgSignature']).replaceWith(imgSignature);
		} else {
			$(_eventAdd.els['signatureBtn']).before(imgSignature);
		}
		_eventAdd.els['imgSignature'] = imgSignature;
	}
	
	this.addSaveBtn = function() {
		var saveEvent = $.tmpl(app.templates['button'], _eventAdd.template_data['saveEvent']);
		
		// Add to DOM
		_eventAdd.els['parent']
			.append($.tmpl(app.templates.hr))
			.append(saveEvent);
		_eventAdd.els['saveEvent'] = saveEvent;
		
		// Add Events
		_eventAdd.els['saveEvent'].click(_eventAdd.saveEvent);
	}

	this.getFieldData = function() {
		var data = {};

		// Add StudentId
		data['studentid'] = app.studentSearch.selectedStudent.id;
		
		// Add userid
		data['userid'] = app.data.user.id;
		
		// Get field data
		$('[data-field]:visible').each(function(x, el) {
			var key = $(this).attr('data-field');
			var val = $(this).val();
			if (key && val) data[key] = val;
		});
		
		// Multi
		// NEEDS TO BE FIXED!!!!
		$.each($("[data-type='MULTI']"), function(x, multi) {
			var key = $(this).attr('data-field'),
				selected = $(this).find("input:checked + label");
			
			data[key] = [];
			$.each(selected, function(x, el) {
				data[key].push($(el).text());
			});
			data[key] = data[key].join(';');
		});

		//Signature
		if (_eventAdd.els['imgSignature']) {
			data['signature'] = _eventAdd.els['imgSignature'].src
		}

		return data;
	}
	
	this.saveExit = function(params) {
		var data = _eventAdd.getFieldData();
		
		// Add followup email data
		if (params && params['email']) {
			data = $.extend({}, data, {
				followup: 1
			});
		}
		
		$.ajax({
			type: "POST",
			url: _eventAdd.apis.saveEvent,
			data: data,
			dataType: 'json',
			offline: true
		})
		.always(function(response) {
			app.global.alert({
				msg	:'Saved', 
				icon: 'check-circle',
				cb	: app.controller.prevSlide
			});
		});
	}
	
	this.saveEvent = function() {
		if (!_eventAdd.validateFields()) return false;
		if (!app.data.user) {
			app.login.loginDialog();
			return false;
		}
		
		app.global.dialogConfirm({
			msg: 'Would you like to save this event?',
			saveCloseCallback: function() {
				_eventAdd.followUpConfirm();
			}
		});
	}
	
	this.followUpConfirm = function() {
		app.global.dialogConfirm({
			msg: "Does this student need follow up?",
			animate: true,
			saveCloseCallback: function() {
				_eventAdd.getFollowUpEmails();
			},
			cancelCloseCallback: function() {
				_eventAdd.saveExit();
			}
		});
	}
	
	/*
	 * Get connected users to student
	 */
	this.getFollowUpEmails = function() {

		$.ajax({
			type: "POST",
			url: _eventAdd.apis.followConnections,
			data: {
				'id': app.studentSearch.selectedStudent.id
			},
			dataType: 'json',
			offline: true
		})
		.always(function(response) {
			if (response && response.users) {
				_eventAdd.data['connectedUsers'] = response.users;
			} else {
				_eventAdd.data['connectedUsers'] = new Array();
			}
			_eventAdd.followUpDialog();
		});
	}
	
	this.followUpDialog = function() {
		var eventData = _eventAdd.getFieldData(),
			message = "",
			subject = "Student Followup",
			studentName = (app.studentSearch.selectedStudent.fname + " " + app.studentSearch.selectedStudent.lname);

		message += "This student requires followup:\n"
		message += "Student: " + studentName + "\n";
		if (eventData.timestamp) message += "Date: " + eventData.timestamp + "\n";
		if (eventData.duration) message += "Duration: " + eventData.duration + "\n";
		if (eventData.reason) message += "Reason: " + eventData.reason + "\n";
		if (eventData.notes) message += "Notes: " + eventData.notes + "\n";
		if (studentName) subject += ": " + studentName;

		EventManager.observe_once('email:exit', _eventAdd.saveExit);
		app.email.init({
			'message': message,
			'subject': subject,
			'to': _eventAdd.data['connectedUsers'],
			'api': _eventAdd.apis.followup,
		});
	}

};