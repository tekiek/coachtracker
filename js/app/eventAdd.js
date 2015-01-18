app['eventAdd'] = new function() {
	_eventAdd = this;
	this.schools;
	
	this.els = {
		parent: $('div#event-add')
	}
	
	this.templates = {
		'input_field'	: '\
			<div class="input-group input-group-lg ">\
				<span class="input-group-addon"><i class="fa ${icon} fa-fw"></i></span>\
			</div>',
	}
	
	this.template_data = {
		'signatureBtn': {
			'color'			: 'btn-default',
			'btnSize'		: 'btn-lg',
			'icon'			: 'fa-pencil',
			'iconSize'		: 'fa-lg',
			'text'			: 'ADD SIGNATURE'
		},
		'saveEvent': {
			'color'			: 'btn-success',
			'btnSize'		: 'btn-lg',
			'icon'			: 'fa-check-circle',
			'iconSize'		: 'fa-lg',
			'text'			: 'SAVE!',
			'classes'		: 'marginBottom10'
		}
	}
	
	this.init = function() {
		_eventAdd.setupHeader();
	}

	this.setupHeader = function() {
		app.header.addBackButton();
		app.header.addHelp();
		app.header.addUserField();
		app.studentSearch.addStudentSearch();
	}
	
	this.userSelected = function() {
		_eventAdd.addStudentImage();
		_eventAdd.addFields();
		_eventAdd.addSignatureBtn();
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
			var fieldWrapper = $.tmpl(_eventAdd.templates.input_field, field),
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
		var optionEl = $.tmpl(app['fieldController']['templates']['option'], {
			'key'	: params['option'],
			'value'	: params['option']
		});
		_eventAdd.els.location.field.append(optionEl);
		_eventAdd.els.location.field.val(params['option']);
		app.global.dialogClose();
	}
	
	this.addSignatureBtn = function() {
		var signatureBtn = $.tmpl(app.global.templates['button'], _eventAdd.template_data['signatureBtn']);
		
		// Add to DOM
		_eventAdd.els['parent']
			.append(signatureBtn)
			.append($.tmpl(app.global.templates.hr));
		_eventAdd.els['signatureBtn'] = signatureBtn;

		// Add Events
		$(signatureBtn).click(function() {
			app.signature.init();
		});

		EventManager.observe('signature.complete', _eventAdd.returnSignature);
	}
	
	this.returnSignature = function(imgSignature) {
		_eventAdd.els['imgSignature'] = imgSignature;
		_eventAdd.els['signatureBtn'].replaceWith(imgSignature);
	}
	
	this.addSaveBtn = function() {
		var saveEvent = $.tmpl(app.global.templates['button'], _eventAdd.template_data['saveEvent']);
		
		// Add to DOM
		_eventAdd.els['parent'].append(saveEvent);
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
		
		// Reason
		// NEEDS TO BE FIXED!!!!
		data['reason'] = [];
		$.each($("[data-type='MULTI'] input:checked + label"), function(x, el) {
			data['reason'].push($(el).text());
		});
		data['reason'] = data['reason'].join(';');

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
			url: "backend/forms/event_add.php",
			data: data,
			dataType: 'json',
			offline: true
		})
		.always(function(response) {
			app.global.alert({
				msg	:'Saved', 
				icon: 'fa-check-circle',
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
					'to': true,
					'api': 'backend/forms/event_followup.php'
				});
			},
			cancelCloseCallback: function() {
				_eventAdd.saveExit();
			}
		});
	}

};