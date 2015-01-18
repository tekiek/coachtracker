app['email'] = new function() {
	_email = this;
	
	this.els = {};
	this.data = {};

	this.init = function(params) {
		_email.clearFrom();
		_email.data = params;
		
		_email.buildUI();
		if (_email.data.to) {
			_email.getUsers();
			_email.buildToUI();
		}
		_email.showDialog();
	}
	
	this.clearFrom = function() {
		_email.els = {};
		_email.template_data = {
			'followUpUsers' : {
				'type'			: 'select',
				'options'		: {
					0: 'Select a user'
				},
				'classes'		: 'marginBottom10'
			},
			'followUpMsg'	: {
				'type'			: 'textarea',
				'placeholder'	: 'Message',
				'classes'		: 'marginBottom10'
			}
		}
	}
	
	/*
	 * Get superiors from user data
	 */
	this.getUsers = function() {
		var users = app.data.user.users;

		// Add users
		_email.data['users'] = {};
		$.each(users, function(x, user) {
			// hack for remove admins - FIX ME!
			if (user['admin'] != 1) {
				_email.data.users[user['id']] = user['name'];
			}
		});
		_email.data.users[app.data.user.id] = app.data.user.name;
	}

	/*
	 * Build dialog w/message field
	 */
	this.buildUI = function() {
		var msgTemplate = $.extend({}, _email.template_data['followUpMsg']);

		// Add message
		if (_email.data.message) {
			msgTemplate['value'] = _email.data.message;
		}

		_email.els['dialog'] = $.tmpl(app.global.templates.div),
		_email.els['message'] = app.fieldController.createField(msgTemplate);

		_email.els['dialog']
			.append(_email.els['message']);
	}
	
	/*
	 * Build TO fields
	 */
	this.buildToUI = function() {
		var usersTemplate = $.extend({}, _email.template_data['followUpUsers']);
		
		// Add users
		$.each(_email.data.users, function(x, user) {
			usersTemplate.options[x] = user;
		});
		
		_email.els['userSelect'] = app.fieldController.createField(usersTemplate),
		_email.els['toWrapper'] = app.fieldController.createFieldWrapper({
			'text': 'To',
			'size': ' '
		}),
		_email.els['toField'] = $.tmpl(app.global.templates.div, {
			'classes': 'form-control expand'
		});
		
		_email.els['toWrapper']
			.append(_email.els['toField']);
			
		_email.els['dialog']
			.prepend(_email.els['toWrapper'])
			.prepend(_email.els['userSelect']);
			
			
		// Add Events
		_email.els['userSelect'].change(function() {
			var val = $(this).val(),
				userName = $(this).find("option:selected").text();
				toUser = $.tmpl(app.global.templates.badge, {
					'classes'	: 'pointer followup-user',
					'text'		: userName
				});
		
			// Add to DOM
			_email.els['toField'].append(toUser);
			toUser.attr('data-id', val);
			$(this).val(0);
		
			// Add events
			toUser.click(function() {
				$(this).remove();
			});
		});
	}

	this.showDialog = function() {
		app.global.dialogConfirm({
			width: ($(document).width() > 500 ? 500 : $(document).width()),
			yesBtn: 'Send Email',
			noBtn: 'Cancel',
			msg: _email.els['dialog'],
			animate: true,
			saveCallback: function() {
				var hasError = _email.verifyForm();
				app.global.dialogToggleError({
					error: hasError
				});
			},
			saveCloseCallback: function() {
				_email.sendEmail();
			},
			cancelCloseCallback: function() {
				EventManager.fire('email:exit');
			}
		});
	}
	
	this.verifyForm = function() {
		var followUpMsg = _email.els['message'].val(),
			error = false;

		// Check to field
		if (_email.data.to) {
			var followUpUsers = _email.els['toField'].find('.followup-user');

			if (followUpUsers.length == 0) {
				error = true;
				_email.els['toField'].addClass('error');
			} else {
				_email.els['toField'].removeClass('error');
			}
		}

		// Check message
		if (followUpMsg.length == 0) {
			error = true;
			_email.els['message'].addClass('error');
		} else {
			_email.els['message'].removeClass('error');
		}
		
		return error;
	}
	
	this.getData = function() {
		var data = new Object();
		
		// To
		if (_email.data.to) {
			var followUpUsers = _email.els['toField'].find('.followup-user');
			data['to'] = new Array();
			$.each(followUpUsers, function(x, user) {
				var userId = $(user).attr('data-id');
				data['to'].push(userId);
			});
		}
		
		// Msg
		data['msg'] = _email.els['message'].val();
		
		// From
		data['from'] = {
			'name': app.data.user.name,
			'email': app.data.user.email
		}
		
		// Subject
		data['subject'] = _email.data.subject;
		
		return data;
	}
	
	this.sendEmail = function() {
		var data = _email.getData();
		
		$.ajax({
			type: "POST",
			url: _email.data.api,
			data: data,
			dataType: 'json',
			offline: true
		})
		.always(function(response) {
			console.log('response', response);
			EventManager.fire('email:exit', {
				email: data
			});
		});
	}
	
};