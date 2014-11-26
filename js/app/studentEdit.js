app['studentEdit'] = new function() {
	var _studentEdit = this;
	this.user = null;
	this.els = {
		parent: $('div#user-screen')
	}
	this.templates = {
		'userField'	: '<div class="input-group input-group-lg"></div>',
		'editBtn'	: '<span class="input-group-addon edit-user-btn"><i data-action="edit" class="fa fa-pencil fa-lg"></i></span>',
		'cancelBtn'	: '<span class="input-group-addon edit-user-btn"><i data-action="cancel" class="fa fa-times fa-lg"></i></span>',
		'saveBtn'	: '<span class="input-group-addon edit-user-btn"><i data-action="save" class="fa fa-floppy-o fa-lg"></i></span>',
		'eventsBtnWrapper': '<div class="c"></div>'
	};

	this.init = function() {
		_studentEdit.setupHeader();
	}
	
	this.setupHeader = function() {
		app.header.addBackButton();
		app.header.addUserField();
		app.studentSearch.addStudentSearch()
	}
	
	this.userSelected = function() {
		_studentEdit.user = app.studentSearch.selectedStudent;

		_studentEdit.els['parent'].empty();
		_studentEdit.addUserImage();
		_studentEdit.addFields();
	}

	this.addUserImage = function() {
		app.imageAdd.addUserImage({
			user: _studentEdit.user,
			appendTo: _studentEdit.els['parent'],
			uploadCb: _studentEdit.saveUserImage
		});
	}
	
	this.addFields = function() {
		var userFields = app['fieldController'].getFields(app['fieldsStudent']);
		_studentEdit.els['userFields'] = new Array();
	
		$.each(userFields, function(key, fieldData) {
			fieldData['value'] = _studentEdit.user[key];
			var userField = $.tmpl(_studentEdit.templates.userField, {}),
				editBtn = $.tmpl(_studentEdit.templates.editBtn, {}),
				cancelBtn = $.tmpl(_studentEdit.templates.cancelBtn, {}),
				saveBtn = $.tmpl(_studentEdit.templates.saveBtn, {}),
				field = app.fieldController.createField(fieldData);

			// Add elements
			$(userField)
				.append(field)
				.append(cancelBtn)
				.append(saveBtn)
				.append(editBtn);
			_studentEdit.els['parent'].append(userField);

			// Set initial instance
			$(field).attr('disabled', 'disabled');
			$(saveBtn).hide();
			$(cancelBtn).hide();

			// Store elements
			var index = _studentEdit.els['userFields'].length;
			_studentEdit.els['userFields'].push({
				'key'			: key,
				'userField'		: $(userField),
				'field'			: $(field),
				'placeholder'	: fieldData['placeholder'],
				'cancelBtn'		: $(cancelBtn),
				'saveBtn'		: $(saveBtn),
				'editBtn'		: $(editBtn),
				'value'			: _studentEdit.user[key],
				'mask'			: fieldData['mask'],
				'editMode'		: false,
				'validLength'	: fieldData['validLength']
			});

			// Add Click handlers
			$(editBtn).click({index: index, editMode: true}, _studentEdit.toggleFieldBtns);
			$(cancelBtn).click({index: index, editMode: false}, _studentEdit.toggleFieldBtns);
			$(saveBtn).click({index: index}, _studentEdit.updateField);
		})
	}
	
	this.updateField = function(e) {
		var data = e['data'];
		var userField = _studentEdit.els['userFields'][data['index']],
			newVal = userField['field'].val();

		// Validate Entry
		if (newVal < userField['validLength'] || newVal < 3) { 
			userField['userField'].addClass('has-error');
			userField['field'].focus();
			return false;
		} else {
			userField['userField'].removeClass('has-error');
		}

		// Create save params
		var updateData = {
			id		: _studentEdit.user['id'],
			field	: userField['key'],
			value	: newVal
		}

		// Save new values
		app.global.dialogConfirm({
			msg: 'Update to ' + updateData['value'] + '?',
			saveCallback: function() {
				$.ajax({
					type: "POST",
					url: "backend/forms/student_field_update.php",
					data: updateData,
					dataType: 'json'
				})
				.done(function(response) {
					console.log('response', response);
					if (response.success == 'true') {
						app.global.alert({
							msg	:'Saved', 
							icon: 'fa-check-circle'
						});
						userField['value'] = newVal;
						_studentEdit.user[userField['key']] = newVal;
						_studentEdit.disableField(userField);
						app.ls.setItem('user', app.data.user);
					} else {
						app.ajaxError('Unable to save user.');
					}
				});
			}
		});
	}
	
	this.disableField = function(userField) {
		userField['userField'].removeClass('has-error')
		$(userField['editBtn']).show();
		$(userField['saveBtn']).hide();
		$(userField['cancelBtn']).hide();
		$(userField['field'])
			.unmask()
			.val(userField['value'])
			.attr('disabled', 'disabled');
		userField['editMode'] = false;
	}
	
	this.enableField = function(userField) {
		$(userField['editBtn']).hide();
		$(userField['saveBtn']).show();
		$(userField['cancelBtn']).show();
		$(userField['field'])
			.removeAttr('disabled')
			.val('')
			.focus();
		if (userField['mask']) { $(userField['field']).mask(userField['mask']); }
		userField['editMode'] = true;
	}
	
	this.toggleFieldBtns = function(e) {
		var data = e['data'];
		var editMode = data['editMode'],
			userField = _studentEdit.els['userFields'][data['index']];

		if (editMode) {
			// Close all other open fields 
			$.each(_studentEdit.els['userFields'], function(x, field) {
				if (field['editMode']) _studentEdit.disableField(field);
			})
			_studentEdit.enableField(userField);
		} 
		else if (userField['editMode']) {
			_studentEdit.disableField(userField);
		}
	}
};