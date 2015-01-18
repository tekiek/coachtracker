app['header'] = new function() {
	var _header = this;

	this.templates = {
		'backText'		: '<span class="text-shadow">Back</span>',
		'backWrapper'	: '<div class="back-btn-wrapper left pointer"></div>',
		'searchWrapper'	: '<div class="search-wrapper"></div>',
		'searchField'	: '<div class="input-group input-group"></div>',
		'iconWrapper'	: '<span class="input-group-addon"></span>',
		'inputSearch'	: '<input id="test" type="text" class="form-control" placeholder="Search for user">',
		'userField'		: '<div class="userField"></div>',
		'userImg'		: '<img class="userImg" src="${image}sz=30">',
		'userName'		: '<div class="userName text-shadow">${name}</div>'
	}

	this.template_data = {
		'logoWrapper': {
			'classes'		: 'left logo-wrapper text-shadow'
		},
		'logoIcon': {
			'icon'		: 'fa-comments-o logo-icon',
			'iconSize'	: 'fa-3x',
			'gtAct'		: 'logo'
		},
		'backBtnIcon': {
			'icon'			: 'fa-chevron-circle-left text-shadow',
			'iconSize'		: '',
			'gtAct'			: 'back'
		},
		'iconSearch': {
			'icon'			: 'fa-search',
			'iconSize'		: 'fa-lg',
			'gtAct'			: 'search:go'
		},
		'iconCancel': {
			'icon'			: 'fa-times-circle',
			'iconSize'		: 'fa-lg',
			'gtAct'			: 'search:cancel'
		},
		'iconUser': {
			'icon'			: 'fa-user text-shadow pointer',
			'iconSize'		: 'fa-2x',
			'gtAct'			: 'signout'
		},
		'helpWrapper': {
			'classes'		: 'right text-shadow help-wrapper'
		},
		'help': {
			'icon'			: 'fa-question-circle text-shadow pointer',
			'iconSize'		: 'fa-2x',
			'gtAct'			: 'help'
		}
	}

	this.els = {
		parent: $('#header-fields')
	}

	this.destroy = function() {
		// Delete Search Field
		if (_header.els.hasOwnProperty('searchField')) _header.destroySearch();

		_header['els']['parent'].empty();
		//_header.els = new Object();
	}
	
	this.show = function() {
		var animation = 'fadeInDown',
			speed = 'default';
		
		app.global.animate(_header['els']['parent'].children(), animation, speed, function() {
			EventManager.fire('header:show');
		});
	}
	
	this.toggle = function(show) {
		if (typeof show != 'boolean') show = true;
		$('header')[show ? 'show' : 'hide']();
	}
	
	this.addBackButton = function() {
		var backWrapper = $.tmpl(_header.templates.backWrapper, {}),
			backBtnTxt = $.tmpl(_header.templates.backText, {}),
			backBtnIcon = $.tmpl(app.global.templates.icon, _header.template_data['backBtnIcon']);
		
		$(backWrapper)
			.append(backBtnIcon)
			.append(backBtnTxt)
			.click(app.controller.prevSlide);
		
		_header['els']['parent']
			.empty()
			.append(backWrapper)
			.show();
	}
	
	this.addLogo = function() {
		var logoWrapper = $.tmpl(app.global.templates.div, _header.template_data['logoWrapper']),
			logoIcon = $.tmpl(app.global.templates.icon, _header.template_data['logoIcon']);
			
		logoWrapper.append(logoIcon);
		_header['els']['parent'].append(logoWrapper);
	}
	
	this.addHelp = function() {
		var helpWrapper = $.tmpl(app.global.templates.div, _header.template_data['helpWrapper']),
			helpIcon = $.tmpl(app.global.templates.icon, _header.template_data['help']),
			userName = $.tmpl(_header.templates.userName, { name: 'Help!' });
			
		helpWrapper
			.append(helpIcon)
			.append(userName);
		_header['els']['parent'].append(helpWrapper);
		
		helpWrapper.click(function() {
			app.email.init({
				'message': 'I had the following issue ...',
				'subject': 'Error Email',
				'to': false,
				'api': 'backend/forms/help_email.php'
			});
		})
	}

	/************** LOGIN ***************/
	this.addUserField = function() {
		var isLoggedIn = app.login.getLoggedInStatus(),
			userField = $.tmpl(_header.templates.userField),
			userName = $.tmpl(_header.templates.userName), 
			userImg = $.tmpl(app.global.templates.icon, _header.template_data['iconUser']);

		// Add UI
		$(userField)
			.append($(userImg))
			.append($(userName));
		_header.addField($(userField));
		_header.els['userField'] = $(userField);
		_header.els['userImg'] = $(userImg);
		_header.els['userName'] = $(userName);

		// Add Events
		EventManager.observe('logout', _header.toggleUser);
		EventManager.observe('login', _header.toggleUser);
		
		_header.els['userField'].click(function() {
			var isLoggedIn = app.login.getLoggedInStatus();
			app.login[isLoggedIn ? 'showLogout' : 'loginDialog']();
		})

		// Show
		if (isLoggedIn) {
			_header.userLoggedIn();
		} else {
			_header.userLoggedOut();
		}
		
	}
	
	this.toggleUser = function() {
		app.global.animate(_header.els['userField'], 'flipOutY', null, function() {
			var isLoggedIn = app.login.getLoggedInStatus();
			app.header[isLoggedIn ? 'userLoggedIn' : 'userLoggedOut']();
			app.global.animate(_header.els['userField'], 'flipInY');
		});
	}
	
	this.userLoggedOut = function() {
		_header.els['userName']
			.text('Login');
	}

	this.userLoggedIn = function() {
		_header.els['userName']
			.text(app['data']['user']['name']);
	}
	
	this.addSearch = function(searchField) {
		var speed = 'default',
			animationOut = 'flipOutX',
			animationIn = 'flipInX';

		_header.els['searchField'] = searchField;
		_header.addField(searchField);
		app.global.els['body'].addClass('hasSearchField');

		$(document).bind('scroll.search', function() {
			var currVisible = searchField.is(':visible'),
				currPos = $(document).scrollTop();
			
			if (currVisible && currPos > 80) {
				app.global.animate(searchField, animationOut, speed, function() {
					searchField.hide();
				});
			} 
			else if (!currVisible && currPos < 60) {
				searchField.show();
				app.global.animate(searchField, animationIn, speed);
			}
		});
	}
	
	this.destroySearch = function() {
		// Remove Element
		_header.els['searchField'].remove();
		delete _header.els['searchField'];
		
		// Cleanup 
		app.global.els['body'].removeClass('hasSearchField');
		$(document).unbind('scroll.search');
	}
	
	this.addField = function(el) {
		_header['els']['parent']
			.append(el)
			.show();
	}
}();