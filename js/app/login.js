app['login'] = new function() {
	_login = this;
	
	this.els = {};
	this.loginCallBacks = [];
	
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
				'gtAct'			: 'email-address'
			},
			'email_wrapper': {
				'icon'			:'fa-envelope-o',
				'classes' 		: 'marginBottom10'
			},
			'password': {
				'type'			:'input',
				'inputType'		: 'password',
				'placeholder'	:'password',
				'mask'			: null,
				'dbId'			: 'password',
				'validLength'	: 3,
				'gtAct'			: 'password'
			},
			'resetPassword': {
				'type'			:'input',
				'inputType'		: 'password',
				'placeholder'	:'password',
				'mask'			: null,
				'dbId'			: 'password',
				'validLength'	: 3,
				'gtAct'			: 'password',
				'regex'			: '^(?=.*[0-9]).{5}'
			},
			'password_wrapper': {
				'icon'			:'fa-lock',
				'classes' 		: 'marginBottom10'
			},
			'resetPassword_wrapper': {
				'icon'			:'fa-lock',
				'classes' 		: 'marginBottom10'
			}
		},
		login: {
			alert: {
				'text'		: 'Invalid Login!'
			},
			msg: {
				'text'			: 'Sign In Here',
				'classes'		: 'center marginBottom10'
			},
			btns: {
				login: {
					'color'			: 'btn-success',
					'btnSize'		: 'btn-lg',
					'classes'		: 'marginBottom10',
					'iconSize'		: 'fa-lg',
					'text'			: 'Sign In',
					'cb'			: function() { _login.signIn(); }
				},
				forgot: {
					'color'			: 'btn-success',
					'btnSize'		: 'btn-lg',
					'classes'		: 'marginBottom10',
					'iconSize'		: 'fa-lg',
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
				'classes'		: 'details'
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
				}
			}
		}
	}
	
	this.init = function() {
		if (!_login.getLoggedInStatus()) _login.loginDialog();
		_login.setAcls();
	}
	
	this.logoutUserIfTheyLeave = function() {
		$(window).bind('beforeunload', function() {
			
		});
	}
	
	this.loggedIn = function(user) {
		app['data']['user'] = user;
		_login.saveUserData();
		_login.setAcls();
		app.controller.loadFirstScreen();
	}
	
	/*
	 * Copy user obect in app data to storage
	 */
	this.saveUserData = function() {
		app.ss.setItem('user', app.data.user);
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
	}
	
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
	
	this.setAcls = function() {
		if (_login.getLoggedInStatus()) {
			app.acl.add('loggedin');
			if (app['data']['user']['admin'] == '1') app.acl.add('admin');
			if (app['data']['user']['coach'] == '1') app.acl.add('coach');
			if (app['data']['user']['counselor'] == '1') app.acl.add('counselor');
			if (app['data']['user']['captain'] == '1') app.acl.add('captain');
			if (app['data']['user']['connect'] == '1') app.acl.add('connect');
		} else {
			app.acl.remove('loggedin');
			app.acl.remove('admin');
			app.acl.remove('coach');
			app.acl.remove('counselor');
			app.acl.remove('captain');
			app.acl.remove('connect');
		}
	}
	
	this.toggleAlert = function(show) {
		if (!show) show = false;
		_login.els['alert'][show ? 'show' : 'hide']();
		if (show) app.global.animate(_login['els']['dialog'], 'tada');
	}
	
	this.hideLogin = function() {
		app.global.animate(_login['els']['dialog'], 'zoomOut', null, function() {
			app['global']['dialogClose']();
			delete _login['els']['dialog'];
		});
	}
	
	this.validateFields = function() {
		var fields = _login['els']['dialog'].find('[data-valid]');
		return app.fieldController.validateFields(fields);
	}
	
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
			wrapper = $.tmpl(app.global.templates.div, templates['dialog']),
			alert = $.tmpl(app.global.templates.alert, type_templates['alert']),
			msg = $.tmpl(app.global.templates.h2, type_templates['msg']),
			hr = $.tmpl(app.global.templates.hr),
			details = $.tmpl(app.global.templates.span, type_templates['details']);

		// Add Msg
		$(wrapper)
			.append(msg)
			.append(hr.clone());
			
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
				field_el_wrapper = app.fieldController.createFieldWrapper(field_templates[field + '_wrapper']);
			
			// Build Field
			$(field_el_wrapper).append(field_el);
			$(wrapper).append(field_el_wrapper);
		});
		$(wrapper).append(hr.clone());
		
		// Add Btns
		var btns = type_templates['btns'];
		$.each(btns, function(i, btn) {
			var btn_el = $.tmpl(app.global.templates.button, btn);
			if (btn['cb']) $(btn_el).click(btn['cb']);
			$(wrapper).append(btn_el);
			_login.els[i] = btn_el;
		});
		
		// Show Dialog
		_login.els['loginWrapper'] = $(wrapper);	
		_login['els']['dialog'] = app['global']['dialog']({
			hideTitle: true,
			msg: $(wrapper),
			animate: true
		});
		
		if (params['submit']) {
			_login.els['loginWrapper'].keyup(function(e) {
				if (e.keyCode == '13') {
					_login.els[params['submit']].click();
				}
			});
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
			url: "backend/forms/users_login.php",
			data: params,
			offline: false
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
					app.login.hideLogin();
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
			url: "backend/forms/users_update_password.php",
			data: params,
			offline: false
		})
		.done(function(r) {
			var response =  $.parseJSON(r);
			if (response.success == 'true') {
				app.login.hideLogin();
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
			url: "backend/forms/users_reset_password.php",
			data: params,
			offline: false
		})
		.done(function(r) {
			var response =  $.parseJSON(r);
			if (response.success == 'true') {
				app.global.alert({
					msg	:'Emailed New Password', 
					icon: 'fa-check-circle',
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
			msg: 'Would you like to log out?',
			'yesBtn': 'Log Out',
			'noBtn': 'Cancel',
			saveCallback: function() {
				$.ajax({
					url: "backend/forms/users_logout.php",
					offline: true
				})
				.always(function() {
					app.header.destroy();
					_login.clearUserData();
					_login.setAcls();
				});
			},
			saveCloseCallback: function() {
				_login.loginDialog();
				EventManager.fire('logout');
			}
		})
	}
};