app['login'] = new function() {
	_login = this;
	this.els = {};
	
	this.apis = {
		'userLogin': "backend/_services.php?service=userLogin",
		'pwUpdate': "backend/_services.php?service=pwUpdate",
		'resetPassword': "backend/_services.php?service=resetPassword",
		'userLogout': "backend/_services.php?service=userLogout",
		'students': "backend/_services.php?service=connectedStudents",
	};
	
	this.template_data = {
		dialog: {
			'classes'		: 'login_dialog',
			'gtCat'			: 'login-dialog'
		},
		fields: {
			'email': {
				'name'			: 'email',
				'type'			: 'input',
				'inputType'		: 'text',
				'placeholder'	: 'email@address.com',
				'mask'			: null,
				'dbId'			: 'email',
				'validLength'	: 5,
				'gtAct'			: 'email-address',
			},
			'email_wrapper': {
				'icon'			: 'envelope-o',
				'classes' 		: 'marginBottom10'
			},
			'password': {
				'type'			:'input',
				'inputType'		: 'password',
				'placeholder'	:'password',
				'mask'			: null,
				'dbId'			: 'password',
				'validLength'	: 4,
				'gtAct'			: 'password'
			},
			'resetPassword': {
				'type'			:'input',
				'inputType'		: 'password',
				'placeholder'	:'password',
				'mask'			: null,
				'dbId'			: 'password',
				'validLength'	: 4,
				'gtAct'			: 'password',
				'regex'			: '^(?=.*[0-9]).{5}'
			},
			'password_wrapper': {
				'icon'			: 'lock',
				'classes' 		: 'marginBottom10'
			},
			'resetPassword_wrapper': {
				'icon'			: 'lock',
				'classes' 		: 'marginBottom10'
			}
		},
		login: {
			alert: {
				'text'		: 'Invalid Login!'
			},
			btns: {
				login: {
					'color'			: 'btn-success',
					'btnSize'		: 'btn-lg',
					'text'			: 'Sign In',
					'cb'			: function() { _login.signIn(); }
				},
				forgot: {
					'color'			: 'btn-link',
					'text'			: 'Forgot Password',
					'cb'			: function() { _login.pwResetDialog(); }
				}
			}
		},
		pwUpdate: {
			alert: {
				'text'		: 'Error!'
			},
			msg: {
				'text'			: 'Update Password',
				'classes'		: 'center marginBottom10'
			},
			details: {
				'text'			: 'We require a password that is 5 characters long and includes 1 number.',
				'classes'		: 'alert alert-danger shadow'
			},
			btns: {
				reset: {
					'color'			: 'btn-success',
					'btnSize'		: 'btn-lg',
					'classes'		: 'marginBottom10',
					'iconSize'		: 'fa-lg',
					'text'			: 'Update Password',
					'cb'			: function() { _login.pwUpdate(); }
				}
			}
		},
		pwReset: {
			alert: {
				'text'		: 'User Not Found!'
			},
			msg: {
				'text'			: 'We will email you a new password.',
				'classes'		: 'center marginBottom10'
			},
			btns: {
				btn: {
					'color'			: 'btn-success',
					'btnSize'		: 'btn-lg',
					'classes'		: 'marginBottom10',
					'iconSize'		: 'fa-lg',
					'text'			: 'Reset Password',
					'cb'			: function() { _login.pwReset(); }
				},
				forgot: {
					'color'			: 'btn-link',
					'text'			: 'Cancel',
					'cb'			: function() { _login.loginDialog(); }
				}
			}
		}
	}
	
	this.init = function() {
		_login.getEls();
		_login.setAcls();
		
		if (_login.getLoggedInStatus()) {
			_login.exit();
		} else {
			_login.getLastUser();
			//_login.setupHeader();
			//_login.loginDialog();
			if (app.config.isMobile) {
				_login.loginDialog();
			} else {
				app.login.els.loginBtn.click(_login.loginDialog);
			}
		}
	}
	
	this.getEls = function() {
		_login.els = {
			parent: $('#user-login'),
			loginBtn: $('.header__sign-up-btn')
		};
	}
	
	this.setupHeader = function() {
		app.header.destroy();
		app.header.addLogo();
		app.header.addSignUpButton();
	}
	
	/*
	 * Set the email value to last logged in user
	 */
	this.getLastUser = function() {
		try {
			var lastUser = app.ls.getItem('lastUser');

			if (lastUser) {
				_login.template_data.fields.email['value'] = lastUser;
			}
		} catch (err) { }
	}
	
	/*
	 * Exit the login screen to next screen
	 */
	this.exit = function() {
		if (!_login.hasConnectedStudents()) {
			_login.getConnectedStudents();
		}
		_login.setAcls();
		app.global.dialogClose();
		app.controller.nextSlide(app['menu']);
	}
	
	/*
	 * Checks to see if logged in user has connected students
	 */
	this.hasConnectedStudents = function() {
		if (_login.getLoggedInStatus()) {
			if (app.data.user.students) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}
	
	/*
	 * Get connected students to logged in user
	 */
	this.getConnectedStudents = function() {
		$.ajax({
			type: "POST",
			url: _login.apis.students
		})
		.done(function(r) {
			var response =  $.parseJSON(r);
			if (response.students) {
				app.data.user['students'] = response.students;
				_login.saveUserData();
			}
		});
	}
	
	/*
	 * Call back from login out
	 */
	this.logOut = function() {
		_login.clearUserData();
		location.reload();
		//app.controller.loadFirstScreen();
		EventManager.fire('logout');
	}
	
	/*
	 * Call back from login to update user data
	 */
	this.loggedIn = function(user) {
		app['data']['user'] = user;
		app['data']['lastUser'] = user.email;
		_login.saveUserData();
	}
	
	/*
	 * Copy user obect in app data to storage
	 */
	this.saveUserData = function() {
		app.ss.setItem('user', app.data.user);
		app.ls.setItem('lastUser', app.data.lastUser);
	}
	
	/*
	 * Copy user data from storage to app object
	 */
	this.getUserData = function() {
		return app.ss.getItem('user');
	}
	
	/*
	 * Clear user data from app object and storage
	 */
	this.clearUserData = function() {
		app.ss.removeItem('user');
		delete app.data.user;
		_login.setAcls();
	}
	
	/*
	 * Checks if user data exist
	 */
	this.getLoggedInStatus = function() {
		if (app['data']['user']) {
			return true;
		} else {
			var user = _login.getUserData();
			if (user) {
				app['data']['user'] = user;
				return true;
			} else {
				return false;
			}
		}
	}
	
	/*
	 * Reads user data and sets acls
	 */
	this.setAcls = function() {
		if (_login.getLoggedInStatus()) {
			if (app['data']['user']['admin'] == '1') app.acl.add('admin');
			if (app['data']['user']['coach'] == '1') app.acl.add('coach');
			if (app['data']['user']['counselor'] == '1') app.acl.add('counselor');
			if (app['data']['user']['captain'] == '1') app.acl.add('captain');
			if (app['data']['user']['connect'] == '1') app.acl.add('connect');
			if (app['data']['user']['upload'] == '1') app.acl.add('upload');
			app.acl.add('loggedIn');
			app.acl.remove('loggedOut');
		} else {
			app.acl.remove('admin');
			app.acl.remove('coach');
			app.acl.remove('counselor');
			app.acl.remove('captain');
			app.acl.remove('connect');
			app.acl.remove('upload');
			app.acl.remove('loggedIn');
			app.acl.add('loggedOut');
		}
	}

	/*
	 * Toggle alerts
	 */
	this.toggleAlert = function(show) {
		if (!show) show = false;
		_login.els['alert'][show ? 'show' : 'hide']();
		if (show) app.global.animate(_login.els.parent, 'tada');
	}

	/*
	 * Validate dialog
	 */
	this.validateFields = function() {
		var fields = _login.els.parent.find('[data-valid]');
		return app.fieldController.validateFields(fields);
	}
	
	/*
	 * Get data from dialog
	 */
	this.getFieldData = function() {
		var data = {};
		
		// Get field data
		$('[data-field]:visible').each(function(x, el) {
			var key = $(this).attr('data-field');
			var val = $(this).val();
			if (key && val) data[key] = val;
		});
		
		return data;
	}
	
	this.dialogBuilder = function(params) {
		var type = params['type'],
			templates = _login.template_data,
			type_templates = templates[type],
			wrapper = $.tmpl(app.templates.div, templates['dialog']),
			alert = $.tmpl(app.templates.alert, type_templates['alert']),
			hr = $.tmpl(app.templates.hr),
			details = $.tmpl(app.templates.h2, type_templates['details']),
			focused = false,
			firstView = (_login.els.parent.children().length == 0 ? true : false);

		// Add message
		if (type_templates['msg']) {
			var msg = $.tmpl(app.templates.h2, type_templates['msg']);
			$(wrapper).append(msg);
			$(wrapper).append(hr.clone());
		}

		// Add detail message
		if (type_templates['details']) {
			$(wrapper)
				.append(details)
				.append(hr.clone());
		}
			
		// Add Alert
		$(wrapper).append(alert);
		_login.els['alert'] = $(alert);
		_login.toggleAlert();
		
		// Fields
		var fields = params['fields'],
			field_templates = templates['fields'];

		$.each(fields, function(i, field) {
			var field_el =  app.fieldController.createField(field_templates[field]),
				field_valid_length = field_templates[field].validLength,
				field_el_wrapper = app.fieldController.createFieldWrapper(field_templates[field + '_wrapper']);

			// Build Field
			$(field_el_wrapper).prepend(field_el);
			$(wrapper).append(field_el_wrapper);
			
			if (field_valid_length) {
				$(field_el).keyup(function(e) {
					_login.validField({
						field: $(this),
						wrapper: $(field_el_wrapper),
						minLength: field_valid_length
					});
				});
				$(field_el).trigger('keyup');
			}
		});
		if (app.config.isMobile) { $(wrapper).append(hr.clone()); }
		
		// Add Btns
		var btns = type_templates['btns'];
		$.each(btns, function(i, btn) {
			_login.els[i] = $.tmpl(app.templates.button, btn);

			if (btn['cb']) $(_login.els[i]).click(btn['cb']);
			$(wrapper).append(_login.els[i]);
		});
		
		// Show Dialog
		_login.els['loginWrapper'] = $(wrapper);
		_login.els.parent
			.empty()
			.append(_login.els['loginWrapper']);
			
		if (app.config.isMobile) {
			if (!firstView) {
				app.global.animate(_login.els['loginWrapper'], 'slideInLeft');
			}
		} else {
			app.global.dialog({
				msg: _login.els.loginWrapper,
				animate: true,
				title: ' ',
				width: 400,
				transition: 'slideInDown'
			});
			
		}

		// Focus
		setTimeout(function() {
			var first_input = _login.els.loginWrapper.find('input[value=""]')[0];
			$(first_input).focus();
		}, 100);
		
		if (params['submit']) {
			_login.els['loginWrapper'].keyup(function(e) {
				if (e.keyCode == '13') {
					_login.els[params['submit']].click();
				}
			});
		}
		
	}
	
	/*
	 * params:
	 * - field (element)
	 * - wrapper (element)
	 * - minLength (int)
	 */
	this.validField = function(params) {
		var fieldLength = $(params.field).val().length,
			emailValid = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
		
		$(params.wrapper)
			.removeClass('valid-field')
			.removeClass('invalid-field');
		
		if (fieldLength >= params.minLength) {
			$(params.wrapper).addClass('valid-field');
		}
		else if ($(params.field).attr('data-field') == 'email') {
			if (emailValid.test($(params.field).val())) {
				$(params.wrapper).addClass('invalid-field');
			}
		}
		else if (fieldLength > 0) {
			$(params.wrapper).addClass('invalid-field');
		}
	}
	
	/***************** SIGNIN *****************/
	this.loginDialog = function() {
		_login.dialogBuilder({
			type: 'login',
			fields: ['email', 'password'],
			submit: 'login'
		});
	}
	
	this.signIn = function() {
		if (!_login.validateFields()) return false;
		var params = _login.getFieldData();
		_login.toggleAlert();
		
		$.ajax({
			type: "POST",
			url: _login.apis.userLogin,
			data: params
		})
		.done(function(r) {
			var response =  $.parseJSON(r);
			if (response.success == 'true') {
				// Login
				var user = response.user;
				_login.loggedIn(user);

				// Password reset?
				if (user.pwReset == '0') {
					_login.pwUpdateDialog();
				} else {
					_login.exit();
				}
			} else {
				_login.toggleAlert(true);
			}
		});
	}
	
	/***************** Update Password *****************/
	this.pwUpdateDialog = function() {
		_login.dialogBuilder({
			type: 'pwUpdate',
			fields: ['resetPassword'],
			submit: 'reset'
		});
	}
	
	this.pwUpdate = function() {
		if (!_login.validateFields()) return false;
		var params = _login.getFieldData();
		params['id'] = app.data.user.id;

		$.ajax({
			type: "POST",
			url: _login.apis.pwUpdate,
			data: params,
			offline: false
		})
		.done(function(r) {
			var response =  $.parseJSON(r);
			if (response.success == 'true') {
				_login.exit();
			} else {
				_login.toggleAlert(true);
			}
		});
	}
	
	/***************** Reset Password *****************/
	this.pwResetDialog = function() {
		_login.dialogBuilder({
			type: 'pwReset',
			fields: ['email'],
			submit: 'btn'
		});
	}
	
	this.pwReset = function() {
		if (!_login.validateFields()) return false;
		var params = _login.getFieldData();

		$.ajax({
			type: "POST",
			url: _login.apis.resetPassword,
			data: params,
			offline: false
		})
		.done(function(r) {
			var response =  $.parseJSON(r);
			if (response.success == 'true') {
				app.global.alert({
					msg	:'Emailed New Password', 
					icon: 'check-circle',
					cb	: _login.loginDialog
				});
			} else {
				_login.toggleAlert(true);
			}
		});
	}
	
	/***************** LOGOUT *****************/
	this.showLogout = function() {
		app.global.dialogConfirm({
			animate: true,
			msg: 'Would you like to log out?',
			'yesBtn': 'Log Out',
			'noBtn': 'Cancel',
			saveCallback: function() {
				$.ajax({
					url: _login.apis.userLogout,
				})
				.always(function() {
					_login.logOut();
				});
			}
		})
	}
};