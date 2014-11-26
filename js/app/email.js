app['email'] = new function() {
	_email = this;
	
	this.els = {};
	this.data = {};

	this.init = function(params) {
		_email.clearFrom();
		if (!params) params = params = {};
		if (params.message) _email.data.message = params.message;
		if (params.subject) _email.data.subject = params.subject;

		_email.getUsers();
		_email.buildUI();
		_email.showDialog();
	}
	
	this.clearFrom = function() {
		_email.data = {};
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
	
	this.buildUI = function() {
		var usersTemplate = $.extend({}, _email.template_data['followUpUsers']),
			msgTemplate = $.extend({}, _email.template_data['followUpMsg']);

		// Add users
		$.each(_email.data.users, function(x, user) {
			usersTemplate.options[x] = user;
		});

		// Add message
		if (_email.data.message) {
			msgTemplate['value'] = _email.data.message;
		}

		_email.els['dialog'] = $.tmpl(app.global.templates.div),
		_email.els['userSelect'] = app.fieldController.createField(usersTemplate),
		_email.els['message'] = app.fieldController.createField(msgTemplate);
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
			.append(_email.els['userSelect'])
			.append(_email.els['toWrapper'])
			.append(_email.els['message']);

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
		var followUpUsers = _email.els['toField'].find('.followup-user'),
			followUpMsg = _email.els['message'].val(),
			error = false;

		// Check users
		if (followUpUsers.length == 0) {
			error = true;
			_email.els['toField'].addClass('error');
		} else {
			_email.els['toField'].removeClass('error');
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
	
	this.sendEmail = function() {
		var data = new Object(),
			followUpUsers = _email.els['toField'].find('.followup-user'),
			followUpMsg = _email.els['message'].val();

		// To
		data['to'] = new Array();
		$.each(followUpUsers, function(x, user) {
			var userId = $(user).attr('data-id');
			data['to'].push(userId);
		});

		// Msg
		data['msg'] = followUpMsg;

		// From
		data['from'] = {
			'name': app.data.user.name,
			'email': app.data.user.email
		}
		
		// Subject
		data['subject'] = _email.data.subject;

		$.ajax({
			type: "POST",
			url: "backend/forms/event_followup.php",
			data: data,
			dataType: 'json'
		})
		.done(function(response) {
			console.log('response', response);
			EventManager.fire('email:exit');
		});
	}
	
};