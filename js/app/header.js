app['header'] = new function() {
	var _header = this;
	this.els = {}

	this.data = {
		scrollDelta: 5,
		scrolled: false,
		hasShadow: false,
		currScroll: 0,
		lastScroll: 0
	};

	this.templates = {
		'backText'		: '<span class="text-shadow"></span>',
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
			'icon'		: 'comments-o',
			'classes'	: 'header__logo-icon',
			'gtAct'		: 'logo'
		},
		'backBtnIcon': {
			'icon'			: 'chevron-left',
			'classes'		: 'fa-lg header__back-icon',
			'gtAct'			: 'back'
		},
		'iconSearch': {
			'icon'			: 'search',
			'gtAct'			: 'search:go'
		},
		'iconCancel': {
			'icon'			: 'times-circle',
			'gtAct'			: 'search:cancel'
		},
		'iconUser': {
			'classes'		: 'pointer header__user',
			'icon'			: 'user',
			'gtAct'			: 'signout'
		},
		'helpWrapper': {
			'classes'		: 'right text-shadow help-wrapper'
		},
		'help': {
			'classes'		: 'pointer header__help',
			'icon'			: 'question-circle',
			'gtAct'			: 'help'
		},
		'signup': {
			'classes'		: 'header__sign-up-btn',
			'input'			: 'Sign Up'
		}
	}
	
	this.init = function() {
		_header.getEls();
		_header.scroll();
	}
	
	this.getEls = function() {
		_header.els = {
			parent: $('#header-fields'),
			header: $('header')
		}
	}
	
	this.scroll = function() {
		// Scroll listener
		$(window).scroll(function() {
			_header.data.scrolled = true;
		})
		
		// Check if scrolled
		setInterval(function() {
			if (_header.data.scrolled) {
				_header.data.scrolled = false;
				_header.data.currScroll = $(window).scrollTop();
				
				// Ignore minimal scroll
				if (! (Math.abs(_header.data.lastScroll - _header.data.currScroll) <= _header.data.scrollDelta) ) {
					_header.scrollHideHeader();
					_header.toggleShadow();
				}
			}
		}, 250);
	}
	
	/*
	 * Add shadow to header if on top of elements
	 */
	this.toggleShadow = function() {
		if (_header.data.currScroll > 10 && !_header.data.hasShadow) {
			_header.els.header.addClass('shadow');
			_header.data.hasShadow = true;
		} 
		else if (_header.data.currScroll <= 10 && _header.data.hasShadow) {
			_header.els.header.removeClass('shadow');
			_header.data.hasShadow = false;
		}
	}

	/*
	 * Add shadow to header if on top of elements
	 */
	this.scrollHideHeader = function() {
		var headerHeight = _header.els.header.outerHeight();

		if (_header.data.currScroll > _header.data.lastScroll && _header.data.currScroll > headerHeight) {
			// Hide header
			_header.els.header
				.removeClass('nav-down')
				.addClass('nav-up');
		} else {
			if (_header.data.currScroll + $(window).height() < $(document).height()) { 
				// Show header
				_header.els.header
					.removeClass('nav-up')
					.addClass('nav-down');
			}
		}
		
		// Save last scroll
		_header.data.lastScroll = _header.data.currScroll;

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
			backBtnIcon = $.tmpl(app.templates.svg, _header.template_data['backBtnIcon']);
		
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
		var logoWrapper = $.tmpl(app.templates.div, _header.template_data['logoWrapper']),
			logoIcon = $.tmpl(app.templates.svg, _header.template_data['logoIcon']);
			
		logoWrapper.append(logoIcon);
		_header['els']['parent'].append(logoWrapper);
	}
	
	this.addSignUpButton = function() {
		var helpWrapper = $.tmpl(app.templates.div, _header.template_data['signup']);
		
		_header.els.parent.append(helpWrapper);
		helpWrapper.click(function() {
			window.location.href = "/signup";
		})
	}
	
	this.addHelp = function() {
		var helpWrapper = $.tmpl(app.templates.div, _header.template_data['helpWrapper']),
			helpIcon = $.tmpl(app.templates.svg, _header.template_data['help']),
			userName = $.tmpl(_header.templates.userName, { name: 'Help!' });
			
		helpWrapper
			.append(helpIcon)
			.append(userName);
		_header['els']['parent'].append(helpWrapper);
		
		helpWrapper.click(function() {
			app.email.init({
				'placeholder': 'I had the following issue ...',
				'subject': 'Error Email',
				'to': false,
				'api': 'backend/backend/_services.php?service=helpEmail'
			});
		})
	}

	/************** LOGIN ***************/
	this.addUserField = function() {
		var isLoggedIn = app.login.getLoggedInStatus(),
			userField = $.tmpl(_header.templates.userField),
			userName = $.tmpl(_header.templates.userName), 
			userImg = $.tmpl(app.templates.svg, _header.template_data['iconUser']);

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
		var speed = 'default';

		_header.els['searchField'] = searchField;
		_header.addField(searchField);
		app.global.els['body'].addClass('hasSearchField');
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