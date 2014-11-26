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
			'password_wrapper': {
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
	
	this.loggedIn = function(user) {
		app.ls.setItem('user', user);
		app['data']['user'] = user;
		_login.setAcls();
		app.controller.loadFirstScreen();
	}
	
	this.getLoggedInStatus = function() {
		if (app['data']['user']) {
			return true;
		} else {
			var user = app.ls.getItem('user');
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
		} else {
			app.acl.remove('loggedin');
			app.acl.remove('admin');
			app.acl.remove('coach');
			app.acl.remove('counselor');
			app.acl.remove('captain');
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
			hr = $.tmpl(app.global.templates.hr);
		
		// Add Msg
		$(wrapper)
			.append(msg)
			.append(hr.clone());
			
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
			data: params
		})
		.done(function(r) {
			var response =  $.parseJSON(r);
			console.log('SIGNIN', response);

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
			fields: ['password'],
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
			data: params
		})
		.done(function(r) {
			var response =  $.parseJSON(r);
			console.log('response', response);

			if (response.success == 'true') {
				app.login.hideLogin();
			} else {
				app.ajaxError('Unable to Reset Password.');
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
			data: params
		})
		.done(function(r) {
			var response =  $.parseJSON(r);
			console.log('response', response);

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
					url: "backend/forms/users_logout.php"
				})
				.done(function() {
					app.header.destroy();
					app.ls.removeItem('user');
					delete app['data']['user'];
					app.login.setAcls();
				});
			},
			saveCloseCallback: function() {
				_login.loginDialog();
				EventManager.fire('logout');
			}
		})
	}
};