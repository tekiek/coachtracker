app['scheduleAdd'] = new function() {
	_scheduleAdd = this;
	
	this.els = {
		parent: $('div#schedule-add')
	}
	
	this.templates = {
		'input_field'	: '\
			<div class="input-group input-group-lg ">\
				<span class="input-group-addon"><i class="fa ${icon} fa-fw"></i></span>\
			</div>',
	}
	
	this.template_data = {
		'submitBtn': {
			'color'			: 'btn-success',
			'btnSize'		: 'btn-lg',
			'icon'			: '',
			'iconSize'		: '',
			'text'			: 'Add Reminder'
		}
	}
	
	this.init = function() {
		_scheduleAdd.setupHeader();
	}
	
	this.setupHeader = function() {
		app.header.addBackButton();
		app.header.addHelp();
		app.header.addUserField();
		app.studentSearch.addStudentSearch();
	}
	
	this.loadCallback = function() {
		_scheduleAdd.toggleReminder();
	}
	
	this.userSelected = function() {
		_scheduleAdd.addFields();
		_scheduleAdd.addSubmit();
	}

	this.addFields = function() {
		var scheduleFieldData = app['fieldController'].getFields(app['fieldsSchedule']);

		$.each(scheduleFieldData, function(key, field) {
			var fieldWrapper = $.tmpl(_scheduleAdd.templates.input_field, field),
				fieldEl = app.fieldController.createField(field);
				_scheduleAdd.els[key] = new Object();

			// Add to Dom
			fieldWrapper.append(fieldEl);
			_scheduleAdd.els['parent'].append(fieldWrapper);
			
			// Store Els
			_scheduleAdd.els[key]['wrapper'] = $(fieldWrapper);
			_scheduleAdd.els[key]['field'] = $(fieldEl);
			
			if (key == 'reminderType') {
				$(fieldEl).change(_scheduleAdd.toggleReminder)
			}
			if (key == 'reminderTime' || key == 'reminderMsg') {
				$(fieldWrapper).hide();
			}
		});
	}
	
	this.toggleReminder = function(e) {
		var reminderType = _scheduleAdd.els['reminderType']['field'].val(),
			reminderTime = _scheduleAdd.els['reminderTime']['wrapper'],
			reminderMsg = _scheduleAdd.els['reminderMsg']['wrapper'],
			speed = 'default', 
			animationShow = 'bounceIn';

		if (reminderType == 0) {
			reminderMsg.hide();
			reminderTime.hide();
		} 
		else if (!reminderTime.is(':visible') || !reminderMsg.is(':visible')) {
			reminderTime.css({ 'display': 'table' });
			reminderMsg.css({ 'display': 'table' });
			app.global.animate(reminderTime, animationShow, speed);
			app.global.animate(reminderMsg, animationShow, speed);
		}
	}
	
	this.addSubmit = function() {
		var submitBtn = $.tmpl(app.global.templates.button, _scheduleAdd.template_data['submitBtn']);

		// Add to DOM
		_scheduleAdd.els['parent'].append(submitBtn);

		// Add events
		$(submitBtn).click(_scheduleAdd.saveSchedule)
	}
	
	this.saveSchedule = function() {
		if (!_scheduleAdd.validateFields()) return false;
		if (!app.data.user) {
			app.login.loginDialog();
			return false;
		}
		var data = _scheduleAdd.getFieldData();
		
		app.global.dialogConfirm({
			msg: 'Would you like to schedule this event?',
			saveCallback: function() {
				$.ajax({
					type: "POST",
					url: "backend/forms/schedule_add.php",
					data: data
				})
				.done(function(response) {
					response = $.parseJSON(response);
					if (response.success == 'true') {
						app.global.alert({
							msg	:'Saved', 
							icon: 'fa-check-circle',
							cb	: app.controller.prevSlide
						});
					}
				});
			}
		});
	}
	
	this.getFieldData = function() {
		var data = {};

		// Add studentID
		data['studentid'] = app.studentSearch.selectedStudent.id;
		
		// Add userID
		data['userid'] = app.data.user.id;

		// Get field data
		$('[data-field]:visible').each(function(x, el) {
			var key = $(this).attr('data-field');
			var val = $(this).val();
			if (key && val) data[key] = val;
		});

		data['meetingTime'] = app.fieldController.convertTime(data['meetingTime']);
		if (data['reminderType'] != 0) {
			data['reminderTime'] = _scheduleAdd.reminderTime(data['meetingTime']);
		}

		return data;
	}
	
	this.validateFields = function() {
		var fields = $('[data-valid]:visible');
		return app.fieldController.validateFields(fields);
	}
	

	
	this.reminderTime = function(meetingTime) {
		var timeBefore = Number(_scheduleAdd.els['reminderTime']['field'].val()),
			reminderTime = new Date();

		// Calculate reminder time
		if (meetingTime && typeof timeBefore == 'number') {
			d = new Date(meetingTime);
			d.setHours(d.getHours() - timeBefore);
			reminderTime = app.fieldController.convertTime(d);
		}

		return reminderTime;
	}

};