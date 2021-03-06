app['studentEdit'] = new function() {
	var _studentEdit = this;
	this.user = null;
	this.els = {};
	
	this.template_data = {
		'editBtn': {
			'icon'			: 'pencil',
			'classes'		: ''
		},
		'cancelBtn': {
			'icon'			: 'times',
			'classes'		: ''
		},
		'saveBtn': {
			'icon'			: 'floppy-o',
			'classes'		: ''
		}
	}

	this.init = function() {
		_studentEdit.getEls();
		_studentEdit.setupHeader();
	}
	
	this.getEls = function() {
		_studentEdit.els = {
			parent: $('div#user-screen')
		}
	}
	
	this.setupHeader = function() {
		app.header.addBackButton();
		app.header.addUserField();
		app.studentSearch.init()
	}
	
	this.userSelected = function() {
		_studentEdit.user = app.studentSearch.selectedStudent;

		_studentEdit.els['parent'].empty();
		//_studentEdit.addUserImage();
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
			var userField = $.tmpl(app.templates.field, { classes: fieldData.dbId }),
				editBtn = $.tmpl(app.templates.field_addon, _studentEdit.template_data.editBtn),
				cancelBtn = $.tmpl(app.templates.field_addon, _studentEdit.template_data.cancelBtn),
				saveBtn = $.tmpl(app.templates.field_addon, _studentEdit.template_data.saveBtn),
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
					url: "backend/_services.php?service=studentEdit",
					data: updateData,
					dataType: 'json',
					offline: true
				})
				.always(function(response) {
					app.global.alert({
						msg	:'Saved', 
						icon: 'check-circle'
					});
					userField['value'] = newVal;
					_studentEdit.user[userField['key']] = newVal;
					_studentEdit.disableField(userField);
					app.login.saveUserData();
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