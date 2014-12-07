var app = new function() {
	this.ls = $.sessionStorage();
	//this.ls = $.localStorage();
	
	this.data = {};
	this.config = {
		env: (document.domain == 'localhost' ? 'dev' : 'prod'),
		isMobile: (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false,
		isChrome: (/Chrome/i.test(navigator.userAgent) ) ? true : false,
		isIOS: (/iPhone|iPad|iPod/i.test(navigator.userAgent) ) ? true : false,
		studentImagePath: 'images/students/'
	}

	this.init = function() {
		app.startTimer('load-time');
		app.online.init();
		app.gtrack.init();
		app.ajaxInit();
		if (app.config.isIOS) addToHomescreen();

		// Must be logged in
		if (!app.login.getLoggedInStatus()) {
			app.login.init();
		} else {
			app.login.setAcls();
			app.controller.loadFirstScreen();
		}
		app.endTimer('load-time');
	}

	/* --- Timers ---- */

	this.timers = {}

	this.startTimer = function(id) {
		app.timers[id] = {};
		app.timers[id]['start'] = new Date().getTime();
	}

	this.endTimer = function(id) {
		if (app.timers[id]) {
			app.timers[id]['end'] = new Date().getTime();
			app.timers[id]['time'] = app.timers[id]['end'] - app.timers[id]['start'];
			app.gtrack.track_event('app', id, app.timers[id]['time']);
		}
	}
	
	/* --- AJAX ---- */
	
	this.ajaxInit = function() {
		$.ajaxSetup({
			beforeSend: function(x, s) {
				$(window).overlay({ show: true });
			},
			complete: function(e, x, s) {
				$(window).overlay({show: false, delay: 250 });
				app.ajaxResponseLog(e);
			},
			success: function() {}
		});
		$(document).ajaxError(app.ajaxError);
		$(document).ajaxComplete(app.ajaxComplete);
	}
	
	this.ajaxComplete = function(e, x, s) {
		var gtAct = (x && x.statusText ? x.statusText : ''),
			gtLabel = (s && s.url ? s.url : '');

		app.global.spinner(false);
		app.gtrack.track_event('app:ajax', gtAct, gtLabel);
	}
	
	this.ajaxResponseLog = function(e) {
		try {
			if (e && e.responseText) {
				if (typeof e.responseText == 'string') { 
					console.log('Response:', $.parseJSON(e.responseText)); 
				} else {
					console.log('Response:', e.responseText)
				}
			}
		} catch (e) { console.log('Response: ERROR'); }
	}
	
	this.ajaxError = function(msg) {
		var alertIcon = $.tmpl(app.global.templates.icon, { icon : 'fa-info-circle fa-lg' });
		if (!msg || typeof msg != 'string') msg = 'Sorry, there was an issue.';

		app.global.spinner(false);
		app['global']['els']['dialog']
			.empty()
			.append(alertIcon)
			.append(' ' + msg)
			.dialog({
				resizable: false,
				modal: true,
				title: 'Error!',
				buttons: {
					Cancel:{
						text: 'Ok',
						click: function() {
							$(this).dialog('close');
						}
					} 
				}
			});
	}
}();
$(document).ready(app.init);
app['acl'] = new function() {
	_acl = this;
	this.acls = ['loggedin', 'admin', 'coach', 'counselor'];
	this.can = [];
	this.els = {
		body	: $('body')
	};

	this.add = function(acl) {
		console.log('ADD ACL:', acl);
		_acl.can.push(acl);
		_acl.els.body.addClass('acl-can-' + acl);
	}

	this.remove = function(acl) {
		console.log('REMOVE ACL:', acl);
		_acl.can = $.grep(_acl.can, function(value) {
		  return value != acl;
		});
		_acl.els.body.removeClass('acl-can-' + acl);
	}
	
	this.has = function(acl) {
		return $.inArray(acl, _acl.can) >= 0 ? true : false;
	}
}
app['menu'] = new function() {
	_menu = this;
	
	this.template_data = {
		'panel' : {
			'classes'		: 'panel panel-default'
		},
		'panelBody': {
			'classes' 		: 'panel-body'
		},
		'toolsPanelHead': {
			'classes' 		: 'panel-heading center',
			'input' 		: 'Tools',
		},
		'actionsPanelHead': {
			'classes' 		: 'panel-heading center',
			'input' 		: 'Actions'
		},
		'export': {
			'color'			: 'btn-success',
			'btnSize'		: 'btn-lg',
			'classes'		: 'shadow marginBottom10',
			'acls'			: '',
			'text'			: 'MEETING NOTES',
			'href'			: '/export'
		},
		'upload': {
			'color'			: 'btn-success',
			'btnSize'		: 'btn-lg',
			'classes'		: 'shadow marginBottom10',
			'acls'			: 'acl-admin',
			'text'			: 'UPLOAD USERS',
			'href'			: '/upload'
		},
		'connect': {
			'color'			: 'btn-success',
			'btnSize'		: 'btn-lg',
			'classes'		: 'shadow marginBottom10',
			'acls'			: 'acl-admin acl-captain',
			'text'			: 'ADD CONNECTION',
			'href'			: 'connect/'
		},
		'studentEdit': {
			'color'			: 'btn-primary',
			'btnSize'		: 'btn-lg',
			'classes'		: 'shadow marginBottom10',
			'acls'			: '',
			'text'			: 'MY STUDENTS'
		},
		'eventAdd': {
			'color'			: 'btn-primary',
			'btnSize'		: 'btn-lg',
			'classes'		: 'shadow marginBottom10',
			'acls'			: '',
			'text'			: 'I MET WITH A STUDENT'
		},
		'scheduleAdd': {
			'color'			: 'btn-primary',
			'btnSize'		: 'btn-lg',
			'classes'		: 'shadow marginBottom10',
			'acls'			: 'hidden',
			'text'			: 'SCHEDULE FOLLOW UP'
		},
		'scheduleList': {
			'color'			: 'btn-primary',
			'btnSize'		: 'btn-lg',
			'classes'		: 'shadow marginBottom10',
			'acls'			: 'hidden',
			'text'			: 'UPCOMING MEETINGS'
		}
	}
	
	this.els = {
		parent: $('div#home-screen')
	}
	
	this.init = function() {
		_menu.setupHeader();
		_menu.addButtons();
		_menu.addAdminButtons();
	}
	
	this.setupHeader = function() {
		app.header.addLogo();
		app.header.addUserField();
	}
	
	this.addButtons = function() {
		var buttons = ['studentEdit', 'eventAdd'],
			panel = $.tmpl(app.global.templates.div, _menu.template_data['panel']),
			panelHead = $.tmpl(app.global.templates.div, _menu.template_data['actionsPanelHead']),
			panelBody = $.tmpl(app.global.templates.div, _menu.template_data['panelBody']);
			
		// Add menu
		panel
			.append(panelHead)
			.append(panelBody);
		_menu.els['parent'].append(panel);

		$.each(buttons, function(x, buttonId) {
			var button = $.tmpl(app.global.templates.button, _menu.template_data[buttonId]);
			
			// Add UI
			panelBody.append(button);
			
			// Add Events
			button.click(function() {
				app.controller.nextSlide(app[buttonId]);
			})
		});
	}
	
	this.addAdminButtons = function() {
		var buttons = ['export', 'upload', 'connect'],
			panel = $.tmpl(app.global.templates.div, _menu.template_data['panel']),
			panelHead = $.tmpl(app.global.templates.div, _menu.template_data['toolsPanelHead']),
			panelBody = $.tmpl(app.global.templates.div, _menu.template_data['panelBody']);
			
		// Add menu
		panel
			.append(panelHead)
			.append(panelBody);
		_menu.els['parent'].append(panel);

		$.each(buttons, function(x, buttonId) {
			var template = _menu.template_data[buttonId],
				button = $.tmpl(app.global.templates.button, template);
			
			// Add UI
			panelBody.append(button);
			
			// Add Events
			button.click(function() {
				var href = template['href'] + "?user=" + app.data.user.id;
				window.open(href, '_self');
			})
		});
	}

};
app['global'] = new function() {
	var _global = this;

	this.els = {
		spinner	: $('div#spinner'),
		dialog	: $('div#dialog'),
		alert	: $('div#alert'),
		body	: $('body'),
		content	: $('content')
	};

	this.templates = {
		'button'	: '\
			<button data-action="${text}" class="btn ${color} ${btnSize} ${classes} ${acls} shadow">\
				<i class="fa ${icon} ${iconSize}"></i>\
				<span class="button-text">${text}</span>\
			</button>',
		'icon'		: '<i data-action="${gtAct}" class="fa ${icon} ${iconSize} ${classes}"></i>',
		'hr'		: '<hr>',
		'span'		: '<span class="${classes}">${text}</span>',
		'h2'		: '<h2 class="${classes}">${text}</h2>',
		'h3'		: '<h3 class="${classes}">${text}</h3>',
		'div'		: '<div data-category="${gtCat}" class="${classes}">${input}</div>',
		'anchor'	: '<a href="${a}" target="_blank">${content}</a>',
		'alert'		: '<div class="alert alert-danger" role="alert"><i class="fa fa-info-circle"></i> ${text}</div>',
		'badge'		: '<span class="badge ${classes}">${text}</span>',
		'listGroup'	: '<div class="list-group"></div>',
		'listItem'	: '<a href="#" class="list-group-item"></a>',
		'js' 		: '<script type="text/javascript" src="${src}"></script>',
		'css'		: '<link rel="stylesheet" type="text/css" href="${src}" />'
	}
	
	this.lazyLoadFiles = function(files) {
		$.each(files, function(key, src) {
			var fileType = _global.fileExtension(src);

			if (_global.templates[fileType]) {
				var file = $.tmpl(_global.templates[fileType], {'src':src});
				_global.els.body.append(file);
			}
		})
	}

	this.objValue = function(obj, scope) {
		try {
			if (obj.hasOwnProperty(scope)) return obj[scope];
			else return null;
		} catch (err) {
			return null;
		}
	}

	this.toggleScroll = function(scroll) {
		if (typeof scroll != 'boolean') scroll = true;
		
		$('body').css({
			'overflow': (scroll ? 'visible' : 'hidden')
		})
	}
	
	this.fileExtension = function(file) {
		return (/[.]/.exec(file)) ? /[^.]+$/.exec(file) : undefined;
	}
	
	this.dialog = function(params) {
		// Build params
		if (!params) params = new Object();
		if (!params['msg']) params['msg'] = ' ';
		if (!params['title']) params['title'] = 'Alert!';
		if (!params['resizable']) params['resizable'] = false;
		if (!params['modal']) params['modal'] = true;
		if (!params['position']) params['position'] = 'center';
		if (!params['draggable']) params['draggable'] = false;
		if (params['hideTitle']) params['dialogClass'] = 'noTitleStuff';
		if (!params['buttons']) params['buttons'] = new Object();
		if (!params['width']) params['width'] = 320;
		if (!params['height']) params['height'] = 'auto';
		if (!params['animate']) params['animate'] = false;
		if (!params['transition']) params['transition'] = 'bounceInDown';

		// Show Dialog
		_global.dialogClose();
		_global.els['dialog']
			.append(params['msg'])
			.dialog(params)
		_global.els['dialogForm'] = _global.els['dialog'].parent();
			
		if (params['animate']) {
			app.global.animate(_global.els['dialogForm'], params['transition'], 'slow', function() {
				if (params.openCB) params.openCB();
			});
		} else {
			if (params.openCB) params.openCB();
		}
		return _global.els['dialogForm'];
	}
	
	this.dialogClose = function() {
		if (_global.els['dialog'].hasClass('ui-dialog-content')) {
			_global.els['dialog']
				.empty()
				.dialog('close');
		}
	}
	
	this.addToHomescreen = function() {
		var storageName = 'addToHomescreen';

		addToHomescreen({
			debug: (app.config.env == 'dev' ? true : false),
			startDelay: 0,
			onAdd: function() {
				app.ls.setItem(storageName, true)
			}
		});
	}

	this.dialogConfirm = function(params) {
		if (!params) params = new Object();
		if (!params['msg']) params['msg'] = 'Would you like to save?';
		if (!params['yesBtn']) params['yesBtn'] = 'Yes';
		if (!params['noBtn']) params['noBtn'] = 'No';
		if (!params['error']) params['error'] = false;

		dialogParams = {
			hideTitle: true,
			msg: params['msg'],
			buttons: {
				"save": {
					text: params['yesBtn'],
					class: 'width_50 right btn btn-success',
					click: function() {
						if (params['saveCallback']) params['saveCallback']();
						if (!_global.els['dialog'].dialog('option', 'error')) {
							_global.dialogClose();
							if (params['saveCloseCallback']) params['saveCloseCallback']();
						}
					}
				},
				"cancel": {
					text: params['noBtn'],
					class: 'width_50 left',
					click: function() {
						if (params['cancelCallback']) params['cancelCallback']();
						_global.dialogClose();
						if (params['cancelCloseCallback']) params['cancelCloseCallback']();
					}
				}
			}
		};
		$.extend(params, dialogParams);
		
		app.global.dialog(params);
	}
	
	this.dialogToggleError = function(params) {
		if (!params) params = new Object();
		if (!params['error']) params['error'] = false;
		
		if (_global.els['dialog']) {
			_global.els['dialog'].dialog('option', 'error', params['error']);
		}
	}
	
	this.animate = function(el, animation, speed, callback) {
		if (!$(el)) return false;
		if (!animation) animation = 'bounce';
		if (!speed || speed == 'default') speed = 'animated_0_5';
		if (speed == 'fast') speed = 'animated_0_2';
		if (speed == 'slow') speed = 'animated';
		
		
		$(el)
			.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				$(el)
					.removeClass(speed)
					.removeClass(animation)
				if (callback) callback();
			})
			.addClass(animation)
			.addClass(speed);
	}
	
	this.inputToggleError = function(el, error) {
		if (!$(el).hasClass('input-group')) el = $(el).parents('.input-group').first();
		$(el)[error ? 'addClass' : 'removeClass']('has-error');
	}
	
	this.alert = function(params) {
		if (!params) params = new Object();

		var alert = _global.els.alert,
			icon = (params['icon'] ? $.tmpl(app.global.templates.icon, { iconSize: 'fa-2x', icon: params['icon'] }) : ''),
			msg = (params['msg'] ? $('<span>' + params['msg'] + '</span>') : ''),
			animationIn = 'bounceIn',
			animationOut = 'bounceOut',
			speed = 'default';

		alert
			.empty()
			.append(icon)
			.append(msg)
			.center()
			.show()
		
		app.global.animate(alert, animationIn, speed, function() {
			setTimeout(function() {
				app.global.animate(alert, animationOut, speed, function() {
					alert.hide();
					if (params['cb']) params['cb']();
				});
			}, 250);
		})
			
	}
	
	this.spinner = function(params) {
		if (!params) params = {};
		$(document).overlay(params);
	}
}();
app['signature'] = new function() {
	var _eventSignature = this;
	this.els = {
		parent: $("div#event-signature")
	}
	this.data = {};

	this.templates = {
		'signatureWrapper': '<div class="signatureWrapper"></div>',
		'btnWrapper': '<div class="btnWrapper"></div>'
	}

	this.template_data = {
		'confirmBtn': {
			'color'			: 'btn-success',
			'btnSize'		: 'btn-lg',
			'classes'		: 'width_50 left',
			'icon'			: 'fa-thumbs-up',
			'iconSize'		: 'fa-lg',
			'text'			: 'SAVE'
		},
		'cancelBtn': {
			'color'			: 'btn-danger width_50',
			'btnSize'		: 'btn-lg',
			'classes'		: 'width_50 right',
			'icon'			: 'fa-thumbs-down',
			'iconSize'		: 'fa-lg',
			'text'			: 'Cancel'
		}
	}

	this.init = function() {
		_eventSignature.els.parent.empty();
		_eventSignature.addSignature();
		_eventSignature.open();
	}
	
	this.open = function() {
		_eventSignature.data.scrollPos = $(window).scrollTop();
		window.scrollTo(0, 0);

		app.global.dialogConfirm({
			msg: _eventSignature.els.signatureWrapper,
			width: $(window).width(),
			height: $(window).height(),
			modal: true,
			animate: true,
			position: { my: "top", at: "top", of: window },
			yesBtn: 'Save',
			noBtn: 'Cancel',
			cancelCallback: _eventSignature.exit,
			saveCallback: _eventSignature.getSignature,
			openCB: function() {
				app.global.toggleScroll(false);
			}
		});
	}
	
	this.addSignature = function() {
		var signatureWrapper = $.tmpl(_eventSignature.templates.signatureWrapper);

		_eventSignature.els['parent']
			.append(signatureWrapper);
			
		_eventSignature.els['signatureWrapper'] = $(signatureWrapper);
		_eventSignature.els['signatureWrapper'].signature({guideline: true});
		$(window).bind('resize.resetSignature', _eventSignature.resetSignature);
	}
	
	this.resetSignature = function() {
		clearTimeout(_eventSignature.data.resizeTimer);
		_eventSignature.data.resizeTimer = setTimeout(function() {
			$(window).unbind('resize.resetSignature');
			_eventSignature.init();
		}, 250);
	}
	
	this.getSignature = function() {
		var canvas = app.signature.els.signatureWrapper.find('canvas')[0],
			imgSignature = new Image();

		// Return image
		imgSignature.src = canvas.toDataURL();
		imgSignature.className = 'imgSignature';
		EventManager.fire('signature.complete', imgSignature);

		_eventSignature.exit();
	}
	
	this.exit = function() {
		$(window).unbind('resize.resetSignature');
		app.global.toggleScroll();
		window.scrollTo(0, _eventSignature.data.scrollPos);
		app.global.dialogClose();
	}
};
app['controller'] = new function() {
	_controller = this;
	this.firstScreen = 'menu';
	this.screenListOrder = [];
	this.subScreen = null;
	
	this.loadFirstScreen = function() {
		var currSlide = _controller.currSlide();
		if (currSlide) currSlide.els['parent'].empty();
		
		_controller.screenListOrder = [];
		_controller.screenListOrder.push(app[_controller.firstScreen]);

		app.header.destroy();
		_controller.showSlide();

		// Lazy Load Files
		if (typeof lazyLoadJs != 'undefined') app.lazyLoadFiles(lazyLoadJs);
	}
	
	this.nextSlide = function(nextSlide) {
		var currSlide = _controller.currSlide();

		nextSlide.els['parent'].empty();
		_controller.screenListOrder.push(nextSlide);
		_controller.slideTransfer(currSlide, nextSlide);
	}
	
	this.prevSlide = function() {
		var currSlide = _controller.currSlide();
		_controller.screenListOrder.pop();
		var nextSlide = _controller.currSlide();

		_controller.slideTransfer(currSlide, nextSlide);
	}
	
	this.currSlide = function() {
		return _controller.screenListOrder[_controller.screenListOrder.length - 1];
	}
	
	this.slideTransfer = function(currSlide, nextSlide) {
		var speed = 'default',
			animation = 'slideOutRight';

		window.scrollTo(0, 0);
		app.global.spinner({ show: true });
		app.header.destroy(animation, speed);

		app.global.animate(currSlide.els['parent'], animation, speed, function() {
			currSlide.els['parent'].empty();
			_controller.showSlide();
		});
	}

	
	this.showSlide = function() {
		var speed = 'default',
			animation = 'slideInLeft',
			currSlide = _controller.currSlide();

		$.when(currSlide['init']()).done(function() {
			app.header.show(animation, speed);
			app.global.animate(currSlide.els['parent'], animation, speed, function() {
				app.global.spinner(false);
			});
		});
	}
};
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
app['studentSearch'] = new function() {
	var _studentSearch = this,
		selectedStudent;

	this.data;
	this.els = {};

	this.templates = {
		'searchWrapper'	: '<div data-category="student-search" class="search-wrapper"></div>',
		'searchField'	: '<div class="input-group input-group-lg"></div>',
		'iconWrapper'	: '<span class="input-group-addon"></span>'
	};

	this.template_data = {
		'iconSearch': {
			'icon'			: 'fa-search',
			'iconSize'		: 'fa-lg'
		},
		'iconCancel': {
			'icon'			: 'fa-times-circle',
			'iconSize'		: 'fa-lg'
		},
		'iconUser': {
			'icon'			: 'fa-user',
			'iconSize'		: 'fa-lg'
		},
		'inputSearch': {
			'type'			:'input',
			'inputType'		:'text',
			'placeholder'	:'Search for user',
			'mask'			: null,
			'gtAct'			:'search-field'
		},
	};
	
	/*
	 * init
	 */
	this.addStudentSearch = function() {
		_studentSearch.buildSearchUI();
		_studentSearch.buildStudentList();
		_studentSearch.searchUser();
	}

	/*
	 * build search ui
	 */
	this.buildSearchUI = function() {
		var searchWrapper = $.tmpl(_studentSearch.templates.searchWrapper, {})
			searchField = $.tmpl(_studentSearch.templates.searchField, {})
			iconWrapper = $.tmpl(_studentSearch.templates.iconWrapper, {})
			iconSearch = $.tmpl(app.global.templates.icon, _studentSearch.template_data['iconSearch']),
			iconCancel = $.tmpl(app.global.templates.icon, _studentSearch.template_data['iconCancel']),
			iconUser = $.tmpl(app.global.templates.icon, _studentSearch.template_data['iconUser']),
			inputSearch = app.fieldController.createField(_studentSearch.template_data['inputSearch']);

		$(iconWrapper)
			.append(iconSearch)
			.append(iconCancel)
			.append(iconUser);

		$(searchField)
			.append(iconWrapper)
			.append(inputSearch);
			
		$(searchWrapper)
			.append(searchField);

		_studentSearch.els['searchWrapper'] 	= $(searchWrapper);
		_studentSearch.els['inputSearch'] 		= $(inputSearch);
		_studentSearch.els['iconSearch'] 		= $(iconSearch);
		_studentSearch.els['iconCancel'] 		= $(iconCancel);
		_studentSearch.els['iconUser'] 			= $(iconUser);

		app.header.addSearch(_studentSearch.els['searchWrapper']);
		_studentSearch.els['inputSearch'].focus();
	}
	
	/*
	 * Get students list in Alpha order
	 */
	this.getStudentsSorted = function() {
		var students = app.data.user.students;

		students.sort(function(a, b) {
			var aName = a.fname.toLowerCase(),
				bName = b.fname.toLowerCase();
			return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
		});
		return students;
	}

	/*
	 * Create Student List
	 */
	this.buildStudentList = function() {
		var studentListEL = $.tmpl(app.global.templates.listGroup),
			students = _studentSearch.getStudentsSorted();

		_studentSearch.els['studentListEL'] = studentListEL;

		$.each(students, function(i, student) {
			if (student.id && student.fname && student.lname) {
				var studentEl = $.tmpl(app.global.templates.listItem),
					studentDetails = ['email', 'phone'],
					name = $.tmpl(app.global.templates.h3, {
						'text': student.fname + ' ' + student.lname
					});

				// Add UI
				studentEl
					.attr('data-id', student.id)
					.append(name);
				$.each(studentDetails, function(x, detail) {
					if (student[detail]) {
						var detailEl = $.tmpl(app.global.templates.div, {
							'input': student[detail]
						});
						studentEl.append(detailEl)
					}
				});
				studentListEL.append(studentEl);

				// Add Events
				studentEl.click({
					'studentEl'	: studentEl,
					'student'	: student
				}, _studentSearch.studentSelect);
			}
			
		});
		_controller.currSlide().els.parent.append(studentListEL);
	}

	/*
	 * Student element selected
	 * params:
	 * - studentEl (element)
	 * - student (object)
	 */
	this.studentSelect = function(params) {
		if (!params || !params.data) return false;
		var data = params.data,
			studentEl = data.studentEl,
			student = data.student;

		// Hide all other students
		_studentSearch.toggleSearchResults({
			'visibleIds':  [student.id]
		});

		setTimeout(function() {
			// Textbox animation
			app.global.animate(_studentSearch.els['inputSearch'], 'pulse', 'default', function() {
				_studentSearch.els['inputSearch'].val(student.fname + ' ' + student.lname);
				_studentSearch.searchIcon('user');
			});

			// Student Animation
			app.global.animate(studentEl, 'bounceOutUp', 'default', function() {
				studentEl.hide();
				_studentSearch.getUserData({
					'id': student.id
				});
			});
		}, 250);
		
		app.gtrack.track_event('app:student-search', 'click:student-click');
	}
	
	/*
	 * toggle search icon
	 * params:
	 * - s (string) search | clear
	 */
	this.searchIcon = function(s) {
		_studentSearch.els['iconSearch'].toggle(s == 'search' ? true : false);
		_studentSearch.els['iconCancel'].toggle(s == 'clear' ? true : false);
		_studentSearch.els['iconUser'].toggle(s == 'user' ? true : false);
	}
	
	/*
	 * Format Search Data
	 * params:
	 * - students (array)
	 * response:
	 * - label (string) name
	 * - value (int) studentid
	 */
	this.createSearchData = function(data) {
		var response = new Array();
		
		$.each(data, function(i, entry) {
			if (entry['id'] && entry['fname'] && entry['lname']) {
				response.push({
					value: entry['id'],
					label: entry['fname'] + " " + entry['lname']
				});
			}
		});

		return response;
	}

	/*
	 * Create search autocomplete
	 */
	this.searchUser = function() {
		var students = _studentSearch.createSearchData(app.data.user.students);

		_studentSearch.els['inputSearch']
			.keyup(function(e) {
				var key = e.keyCode,
					searchLength = $(this).val().length;

				if (searchLength > 0) {
					_studentSearch.searchIcon('clear');
				}
				else {
					_studentSearch.toggleSearchResults({
						'reset':  true
					});
					_studentSearch.searchIcon('search');
				}	
			})
			.autocomplete({
				minLength: 1,
				source: students,
				delay: 250,
				response: function(e, u) {
					if (u.content) {
						var IDs = $.map(u.content, function(c, i) {
							return c.value;
						});
						_studentSearch.toggleSearchResults({
							'visibleIds':  IDs
						});
					}
					_studentSearch.els['inputSearch'].autocomplete('close');
				}
			});

		// Add Click Events
		_studentSearch.els['iconCancel'].click(function() {
			_studentSearch.searchIcon('search');
			_studentSearch.els['inputSearch']
				.val('')
				.trigger('keyup');
		});

		// Show UI
		_studentSearch.searchIcon('search');
		_studentSearch.els['searchWrapper'].show();
	}

	/*
	 * toggle student list
	 * params:
	 * - reset (boolean) clear search results
	 * - visibleIds (array) list of ids of search results
	 */
	this.toggleSearchResults = function(params) {
		if (!params) params = {};
		if (!params.reset) params.reset = false;
		if (!params.visibleIds) params.visibleIds = [];
		
		var visibleStudentEls = _studentSearch.els['studentListEL'].find('.list-group-item:visible'),
			visibleIds = params.visibleIds;

		if (params.reset) { 
			// Show all search elements
			var studentEls = _studentSearch.els['studentListEL'].find('.list-group-item');
			$(studentEls).show();
		} 
		else if (visibleIds.length > visibleStudentEls.length) {
			// Back space - show hidden searches 
			var hiddenStudentEls = _studentSearch.els['studentListEL'].find('.list-group-item:hidden')
			$.each(hiddenStudentEls, function(i, studentEl) {
				var studentId = $(studentEl).attr('data-id');
				if ($.inArray(studentId, visibleIds) >= 0) {
					$(studentEl).show();
				}
			})
		}
		else {
			// Hide search elements based upon search results
			if (visibleStudentEls.length > 0 && visibleIds.length != visibleStudentEls.length) {
				$.each(visibleStudentEls, function(i, studentEl) {
					var studentId = $(studentEl).attr('data-id');
					if ($.inArray(studentId, visibleIds) == -1) {
						$(studentEl).hide();
					}
				});
				app.gtrack.track_event('app:student-search', 'updated-search-results');
			}
		}
	}
	
	/*
	 * return selected user
	 * params:
	 * - id (int) student id
	 */
	this.getUserData = function(params) {
		var students = app.data.user.students,
			studentId = params['id'];

		app.global.spinner({ show: true });
		$.each(students, function(x, student) {
			if (studentId == student['id']) {
				_studentSearch.destroy();
				_studentSearch.selectedStudent = student;
				app.global.spinner({ show: false, delay: 500 });
				if (_controller.currSlide()['userSelected']) _controller.currSlide()['userSelected']();
				return false;
			}
		})
	}
	
	this.destroy = function() {
		_studentSearch.els['inputSearch']
			.autocomplete('destroy')
			.attr("disabled", "disabled");
		_studentSearch.els['studentListEL'].remove();
	}
};
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
app['eventAdd'] = new function() {
	_eventAdd = this;
	this.schools;
	
	this.els = {
		parent: $('div#event-add')
	}
	
	this.templates = {
		'input_field'	: '\
			<div class="input-group input-group-lg ">\
				<span class="input-group-addon"><i class="fa ${icon} fa-fw"></i></span>\
			</div>',
	}
	
	this.template_data = {
		'signatureBtn': {
			'color'			: 'btn-default',
			'btnSize'		: 'btn-lg',
			'icon'			: 'fa-pencil',
			'iconSize'		: 'fa-lg',
			'text'			: 'ADD SIGNATURE'
		},
		'saveEvent': {
			'color'			: 'btn-success',
			'btnSize'		: 'btn-lg',
			'icon'			: 'fa-check-circle',
			'iconSize'		: 'fa-lg',
			'text'			: 'SAVE!',
			'classes'		: 'marginBottom10'
		}
	}
	
	this.init = function() {
		_eventAdd.setupHeader();
	}

	this.setupHeader = function() {
		app.header.addBackButton();
		app.header.addUserField();
		app.studentSearch.addStudentSearch();
	}
	
	this.userSelected = function() {
		_eventAdd.addStudentImage();
		_eventAdd.addFields();
		_eventAdd.addSignatureBtn();
		_eventAdd.addSaveBtn();
	}
	
	this.addStudentImage = function() {
		app.imageAdd.addUserImage({
			user: app.studentSearch.selectedStudent,
			appendTo: _eventAdd.els['parent']
		});
	}

	this.addFields = function() {
		var eventFieldData = app['fieldController'].getFields(app['fieldsEvent']);
		
		$.each(eventFieldData, function(key, field) {
			var fieldWrapper = $.tmpl(_eventAdd.templates.input_field, field),
				fieldEl = app.fieldController.createField(field);
				_eventAdd.els[key] = new Object();

			// Add to Dom
			fieldWrapper.append(fieldEl);
			_eventAdd.els['parent'].append(fieldWrapper);

			// Store Els
			_eventAdd.els[key]['wrapper'] = $(fieldWrapper);
			_eventAdd.els[key]['field'] = $(fieldEl);
		});

		// Set default time
		app.eventAdd.els['duration']['field'].val('20');
	}
	
	this.validateFields = function() {
		var fields = $('[data-valid]');
		return app.fieldController.validateFields(fields);
	}

	/*
	 * Add option to location select
	 * params:
	 * - option (string)
	 */
	this.addLocationOption = function(params) {
		var optionEl = $.tmpl(app['fieldController']['templates']['option'], {
			'key'	: params['option'],
			'value'	: params['option']
		});
		_eventAdd.els.location.field.append(optionEl);
		_eventAdd.els.location.field.val(params['option']);
		app.global.dialogClose();
	}
	
	this.addSignatureBtn = function() {
		var signatureBtn = $.tmpl(app.global.templates['button'], _eventAdd.template_data['signatureBtn']);
		
		// Add to DOM
		_eventAdd.els['parent']
			.append(signatureBtn)
			.append($.tmpl(app.global.templates.hr));
		_eventAdd.els['signatureBtn'] = signatureBtn;

		// Add Events
		$(signatureBtn).click(function() {
			app.signature.init();
		});

		EventManager.observe('signature.complete', _eventAdd.returnSignature);
	}
	
	this.returnSignature = function(imgSignature) {
		_eventAdd.els['imgSignature'] = imgSignature;
		_eventAdd.els['signatureBtn'].replaceWith(imgSignature);
	}
	
	this.addSaveBtn = function() {
		var saveEvent = $.tmpl(app.global.templates['button'], _eventAdd.template_data['saveEvent']);
		
		// Add to DOM
		_eventAdd.els['parent'].append(saveEvent);
		_eventAdd.els['saveEvent'] = saveEvent;
		
		// Add Events
		_eventAdd.els['saveEvent'].click(_eventAdd.saveEvent);
	}

	this.getFieldData = function() {
		var data = {};

		// Add StudentId
		data['studentid'] = app.studentSearch.selectedStudent.id;
		
		// Add userid
		data['userid'] = app.data.user.id;
		
		// Get field data
		$('[data-field]:visible').each(function(x, el) {
			var key = $(this).attr('data-field');
			var val = $(this).val();
			if (key && val) data[key] = val;
		});
		
		// Reason
		// NEEDS TO BE FIXED!!!!
		data['reason'] = [];
		$.each($("[data-type='MULTI'] input:checked + label"), function(x, el) {
			data['reason'].push($(el).text());
		});
		data['reason'] = data['reason'].join(';');

		//Signature
		if (_eventAdd.els['imgSignature']) {
			data['signature'] = _eventAdd.els['imgSignature'].src
		}

		return data;
	}
	
	this.saveExit = function() {
		app.global.alert({
			msg	:'Saved', 
			icon: 'fa-check-circle',
			cb	: app.controller.prevSlide
		});
	}
	
	this.saveEvent = function() {
		if (!_eventAdd.validateFields()) return false;
		if (!app.data.user) {
			app.login.loginDialog();
			return false;
		}
		var data = _eventAdd.getFieldData();

		app.global.dialogConfirm({
			msg: 'Would you like to save this event?',
			saveCallback: function() {
				$.ajax({
					type: "POST",
					url: "backend/forms/event_add.php",
					data: data,
					dataType: 'json'
				})
				.done(function(response) {
					if (response.success == 'true') {
						_eventAdd.followUpConfirm();
					} else {
						app.ajaxError('Unable to save user.');
					}
				});
			}
		});
	}
	
	this.followUpConfirm = function() {
		app.global.dialogConfirm({
			msg: "Does this student need follow up?",
			animate: true,
			saveCloseCallback: function() {
				var eventData = _eventAdd.getFieldData(),
					message = "",
					subject = "Student Followup",
					studentName = (app.studentSearch.selectedStudent.fname + " " + app.studentSearch.selectedStudent.lname);

				message += "This student requires followup:\n"
				message += "Student: " + studentName + "\n";
				if (eventData.timestamp) message += "Date: " + eventData.timestamp + "\n";
				if (eventData.duration) message += "Duration: " + eventData.duration + "\n";
				if (eventData.reason) message += "Reason: " + eventData.reason + "\n";
				if (eventData.notes) message += "Notes: " + eventData.notes + "\n";
				if (studentName) subject += ": " + studentName;

				EventManager.observe_once('email:exit', _eventAdd.saveExit);
				app.email.init({
					'message': message,
					'subject': subject
				});
			},
			cancelCloseCallback: function() {
				_eventAdd.saveExit();
			}
		})
	}

};
app['fieldController'] = new function() {
	_fieldController = this;
	
	this.templates = {
		'input'			: '<input data-action="${gtAct}" name="${name}" value="${value}" data-field="${dbId}" data-valid="${validLength}" type="${inputType}" class="form-control" placeholder="${placeholder}" data-mask="${mask}">',
		'textarea' 		: '<textarea data-action="${gtAct}" data-field="${dbId}" data-valid="${validLength}" class="form-control" placeholder="${placeholder}">${value}</textarea>',
		'select'		: '<select data-action="${gtAct}" data-field="${dbId}" class="form-control ${classes}" data-valid="true"></select>',
		'option'		: '<option data-action="${gtAct}" value="${key}" data-field="${dbId}" ${disabled} ${selected}>${value}</option>',
		'multi'			: '<div data-type="MULTI" class="form-control multi" data-valid="${validLength}" ></div>',
		'multi_option'	: '<input data-action="${gtAct}" type="checkbox" name="${key}" id="${key}"><label for="${key}">${value}</label>',
		'field_wrapper'	: '\
			<div class="input-group input-group-${size} ${classes}">\
				<span class="input-group-addon">\
					<i class="fa ${icon} fa-fw">${text}</i>\
				</span>\
			</div>'
	}
	
	this.getFields = function(fields) {
		return jQuery.extend(true, {}, fields);
	}
	
	this.createField = function(fieldData) {
		var fieldType = fieldData['type'],
			templates = _fieldController.templates;

		// Create Field
		if (fieldType == 'select') {
			var fieldEl = $.tmpl(templates['select'], fieldData);
			$.each(fieldData['options'], function(optionKey, optionValue) {
				var defaultOption = (optionKey == '0' || optionKey == 0 ? true : false),
					optionEl = $.tmpl(templates['option'], {
						'key'		: optionKey,
						'value'		: optionValue,
						'disabled'	: (defaultOption ? 'disabled' : ''),
						'selected'	: (defaultOption ? 'selected' : '')
					});
				fieldEl.append(optionEl)
			});
			if (fieldData['value']) fieldEl.val(fieldData['value']);
		}
		else if (fieldType == 'input') {
			var fieldEl = $.tmpl(templates['input'], fieldData);
		}
		else if (fieldType == 'textarea') {
			var fieldEl = $.tmpl(templates['textarea'], fieldData);
		}
		else if (fieldType == 'multi') {
			var fieldEl = $.tmpl(templates['multi'], fieldData);
			$.each(fieldData['options'], function(optionKey, optionValue) {
				var defaultOption = (optionKey == '0' || optionKey == 0 ? true : false),
					optionEl = $.tmpl(templates['multi_option'], {
						'key'		: optionKey,
						'value'		: optionValue,
						'disabled'	: (defaultOption ? 'disabled' : ''),
						'selected'	: (defaultOption ? 'selected' : '')
					});
				fieldEl.append(optionEl)
			});
			if (fieldData['value']) fieldEl.val(fieldData['value']);
		}

		// Add autocomplete?
		if (fieldData['autocomplete']) {
			_fieldController.autoComplete({
				el: fieldEl,
				uri: fieldData['autocomplete']
			});
		}
		
		// Default Timestamp to current time
		if (fieldData['inputType'] == 'date') {
			$(fieldEl).val(new Date().toDateInputValue());
			if (!app.config.isMobile && !app.config.isChrome) $(fieldEl).datepicker();
		}
		
		// Add input mask?
		if (fieldData['mask']) {
			_fieldController.inputMask({
				el: fieldEl,
				mask: fieldData['mask']
			})
		}

		return fieldEl;
	}
	
	this.createFieldWrapper = function(params) {
		if (!params['size']) params['size'] = 'lg';

		var templates = _fieldController.templates,
			fieldWrapper = $.tmpl(templates['field_wrapper'], params);
		
		return fieldWrapper;
	}
	
	this.validateFields = function(fields) {
		var isValid = true;

		$(fields).each(function(x, field) {
			var val = $(this).val(),
				fieldType = ($(this).attr('data-type') ? $(this).attr('data-type') : $(this).prop('tagName')),
				validLength = $(this).attr('data-valid');
				
				

			if (fieldType == 'SELECT') {
				var error = (val == null || val == '0' || val == 0 ? true : false);
			}
			if (validLength && $.isNumeric(validLength)) {
				var error = (typeof val == 'undefined' || val.length < validLength ? true : false);
			}
			if (fieldType == 'MULTI') {
				var options = $(this).find('input[type=checkbox]:checked'),
					selectedCount = options.length;

				var error = (selectedCount < Number(validLength) ? true : false);
			}


			if (error) {
				if (isValid) $(this).focus();
				isValid = false;
				app.global.animate($(this), 'pulse');
			}
			app.global.inputToggleError(this, error);
		});
		
		
		return isValid;
	}
	
	this.inputMask = function(opts) {
		if (!opts['el']) return false;
		if (!opts['mask']) return false;

		$(opts['el']).mask(opts['mask']);
	}
	
	this.autoComplete = function(opts) {
		if (!opts['uri']) return false;

		$(opts['el'])
			.keyup(function(e) {
				$(opts['el']).attr('data-value', null);
			})
			.blur(function() {
				var val = $(opts['el']).attr('data-value');
				if (!val || val == '') $(opts['el']).val('');
			})
			.autocomplete({
				minLength: 3,
				source: opts['uri'],
				open: function(event, ui) {
					var bodyWidth = $('body').width();
					$(this).autocomplete("widget")
						.css({
							width: (bodyWidth >= 800 ? 800 : bodyWidth),
							left: (bodyWidth >= 800 ? ((bodyWidth-800)/2) : 0)
						})
						.addClass('dropdown-menu')
						.scrollIntoView(false);
				},
				select: function(e, u) {
					$(opts['el']).attr('data-value', u.item.id);
				}
			});
		}
	
	this.convertTime = function(time) {
		var d = new Date(time);
		return 	d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate() + ' ' + 
				d.getHours() + ':' + d.getMinutes() + ':00';
	}
};
app['fieldsEvent'] = {
	'timestamp': {
		'type'			:'input',
		'inputType'		:'date',
		'dbId'			:'timestamp',
		'icon'			:'fa-calendar',
		'gtAct'			:'date'
	},
	'location': {
		'type'			:'select',
		'dbId'			: 'location',
		'icon'			:'fa-fax',
		'gtAct'			:'location',
		'options'		: {
			'0'				: 'Location',
			'call'			: 'Call',
			'cbo-office'	: 'CBO Office',
			'college-campus': 'College Campus',
			'email'			: 'Email',
			'facebook'		: 'Facebook',
			'high-school'	: 'High School',
			'text'			: 'Text',
			'Workshop/Event': 'Workshop/Event',
			'other'			: 'Other'
		}
	},
	'duration': {
		'type'			:'select',
		'dbId'			: 'duration',
		'icon'			:'fa-clock-o',
		'gtAct'			:'duration',
		'options'		: {
			'00:05'	: '5M',
			'00:10'	: '10M',
			'00:15'	: '15M',
			'00:20'	: '20M',
			'00:30'	: '30M',
			'00:45'	: '45M',
			'01:00'	: '60M',
			'01:15'	: '75M',
			'01:30'	: '90M',
			'02:00'	: '120M',
			'02:30'	: '150M',
			'03:00'	: '180M'
		}
	},
	'reason': {
		'type'			:'multi',
		'validLength'	: 1,
		'dbId'			:'reason',
		'icon'			:'fa-bullseye',
		'gtAct'			:'reason',
		'options'	: {
			'Financial Aid'				: 'Financial Aid',
			'Money Issues'				: 'Money Issues',
			'Family/Personal'			: 'Family/Personal',
			'Academic Support'			: 'Academic Support',
			'Campus Life'				: 'Campus Life',
			'Job Hunt'					: 'Job Hunt',
			'Planning Coursework'		: 'Student Schedule',
			'Technical Difficulties' 	: 'Technical Difficulties'
		}
	},
	'notes': {
		'type'			:'textarea',
		'placeholder'	:'What did you talk about?',
		'mask'			: null,
		'dbId'			: 'notes',
		'validLength'	: 0,
		'icon'			:'fa-comment-o',
		'gtAct'			:'notes'
	}
};
app['fieldsSchedule'] = {
	'meetingTime': {
		'type'			:'input',
		'placeholder'	: 'Meeting time',
		'inputType'		: 'date',
		'dbId'			: 'meetingTime',
		'icon'			:'fa-calendar',
		'validLength'	: 3,
	},
	'meetingReason': {
		'type'			:'textarea',
		'placeholder'	:'Reason for the meeting...',
		'mask'			: null,
		'dbId'			: 'meetingReason',
		'validLength'	: 3,
		'icon'			:'fa-bullseye'
	},
	'reminderType': {
		'type'			:'select',
		'dbId'			: 'reminderType',
		'icon'			:'fa-comments-o',
		'options'		: {
			0			: 'No Reminder',
			'text'		: 'text',
			'email'		: 'email'
		}
	},
	'reminderTime': {
		'type'			:'select',
		'dbId'			: 'reminderTime',
		'icon'			:'fa-clock-o',
		'options'		: {
			'0'	: 'Schedule Reminder',
			'1'	: '1 hour before',
			'2'	: '2 hours before',
			'4'	: '4 hours before',
			'6'	: '6 hours before',
			'24': '1 day before',
			'72': '3 days before'
		}
	},
	'reminderMsg': {
		'type'			:'textarea',
		'placeholder'	:'This is a reminder...',
		'mask'			: null,
		'dbId'			: 'reminderMsg',
		'validLength'	: 3,
		'icon'			:'fa-pencil-square-o'
	},
};
app['fieldsStudent'] = {
	'fname': {
		'type'			:'input',
		'inputType'		: 'text',
		'placeholder'	:'First Name',
		'mask'			: null,
		'dbId'			: 'fname',
		'validLength'	: 3,
		'icon'			:'fa-user',
		'gtAct'			: 'fname'
	},
	'lname': {
		'type'			:'input',
		'inputType'		: 'text',
		'placeholder'	:'Last Name',
		'mask'			: null,
		'dbId'			: 'lname',
		'validLength'	: 3,
		'icon'			:'fa-user',
		'gtAct'			: 'lname'
	},
	'cbo': {
		'type'			:'input',
		'inputType'		: 'text',
		'placeholder'	:'CBO',
		'mask'			: null,
		'dbId'			: 'cbo',
		'validLength'	: 3,
		'icon'			:'fa-plug',
		'gtAct'			: 'cbo'
	},
	'email': {
		'type'			:'input',
		'inputType'		: 'email',
		'placeholder'	:'Email address',
		'mask'			: null,
		'dbId'			: 'email',
		'validLength'	: 5,
		'icon'			:'fa-envelope-o',
		'gtAct'			: 'email'
	},
	'phone': {
		'type'			:'input',
		'inputType'		: 'tel',
		'placeholder'	:'Phone Number',
		'mask'			: '(999) 999-9999',
		'dbId'			: 'phone',
		'validLength'	: 14,
		'icon'			:'fa-phone',
		'gtAct'			: 'phone'
	},
	'contact': {
		'type'			:'select',
		'dbId'			: 'contact',
		'icon'			:'fa-comments-o',
		'gtAct'			: 'contact',
		'options'		: {
			0			: 'Preferred Contact',
			'phone'		: 'Prefer text',
			'email'		: 'Prefer email'
		}
	},
	'school': {
		'type'			:'input',
		'inputType'		: 'text',
		'placeholder'	:'High School',
		'mask'			: null,
		'dbId'			: 'school',
		'validLength'	: 0,
		'icon'			:'fa-graduation-cap',
		'autocomplete'	: 'backend/forms/school_search.php',
		'gtAct'			: 'school'
	},
	'college': {
		'type'			:'input',
		'inputType'		: 'text',
		'placeholder'	:'College Attending',
		'mask'			: null,
		'dbId'			: 'college',
		'validLength'	: 0,
		'icon'			:'fa-university',
		'autocomplete'	: 'backend/forms/college_search.php',
		'gtAct'			: 'college'
	},
	'notes': {
		'type'			:'textarea',
		'placeholder'	:'Notes',
		'mask'			: null,
		'dbId'			: 'notes',
		'validLength'	: 0,
		'icon'			:'fa-file-o',
		'gtAct'			: 'notes'
	}
};
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
					} else {
						app.ajaxError('Unable to save user.');
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
app['scheduleList'] = new function() {
	_scheduleList = this;

	this.els = {
		parent: $('div#schedule-list')
	}
	
	this.templates = {
		'boxWrapper'		: '<div class="panel panel-default"></div>',
		'boxTitle'			: '<div class="panel-heading">\
									<h3 class="panel-title">${title}</h3>\
								</div>',
		'boxContent'		: '<div class="panel-body"></div>',
		'scheduleTable'		: '<table class="table"></table>',
		'scheduleHeader'	: '<thead><tr><td>Time</td><td>Student</td></tr></thead>',
		'scheduleContent'	: '<tr><td>${date}</td><td>${student}</td></tr>'
	}
	this.template_data = {}

	this.init = function() {
		_scheduleList.setupHeader()
		_scheduleList.getScheduleData();
	}
	
	this.setupHeader = function() {
		app.header.addBackButton();
		app.header.addUserField();
	}

	this.getScheduleData = function() {
		$.ajax({
			type: "POST",
			url: "backend/forms/get_schedule.php",
			data: { 'userid': app.data.user.id },
			dataType: 'json'
		})
		.done(function(response) {
			_scheduleList.showSchedule(response);
			return;
		});
	}
	
	this.cleanTime = function(time) {
		var date = new Date(time),
			hours = date.getHours(),
			minutes = date.getMinutes(),
			ampm = hours >= 12 ? 'pm' : 'am';

			hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0'+minutes : minutes;

		  return (date.getMonth() + 1) + '/' + date.getDate() + ' ' + hours + ':' + minutes + ampm;
	}
	
	this.sortByDate = function(obj1, obj2) {
	    var date1 = new Date(obj1['schedule']['meetingTime']);
	    var date2 = new Date(obj2['schedule']['meetingTime']);
	    return date2 < date1 ? 1 : -1;
	}
	
	this.showSchedule = function(schedules) {

		$.each([1], function(x, date) {
			var boxWrapper = $.tmpl(_scheduleList.templates.boxWrapper),
				boxTitle = $.tmpl(_scheduleList.templates.boxTitle, { 
					title: 'Schedule' 
				}),
				boxContent = $.tmpl(_scheduleList.templates.boxContent),
				scheduleTable = $.tmpl(_scheduleList.templates.scheduleTable),
				scheduleHeader = $.tmpl(_scheduleList.templates.scheduleHeader);

			// Build Table
			$(scheduleTable).append(scheduleHeader)
			$.each(schedules.sort(_scheduleList.sortByDate), function(x, entry) {
				var schedule = entry['schedule'],
					student = entry['student'],
					scheduleContent = $.tmpl(_scheduleList.templates.scheduleContent, { 
						date: _scheduleList.cleanTime(schedule['meetingTime']),
						student: student['fname'] + ' ' + student['lname']
					});

				// Add Row
				$(scheduleTable).append(scheduleContent);
			});
			
			// Add UI
			$(boxContent).append(scheduleTable);
			$(boxWrapper)
				.append(boxTitle)
				.append(boxContent);
			_scheduleList.els['parent']
				.append(boxWrapper);
		});
	}

};
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
			EventManager.fire('email:exit');
		});
	}
	
};
app['gtrack'] = new function() {
	_gtrack = this;
	this.trackable_tags = ["a", "input", "button", "i", "textarea", "select"];
	
	this.init = function() {
		$.each(_gtrack.trackable_tags, function(x, selector) {
			$(document.body).on('click', selector, function(event) {
				var el = $(event.currentTarget).closest(selector)[0];
				_gtrack.click(el);
			});
		})
		
	}

	this.click = function(el) {
		var gt_cat = 'app',
			gt_act = $(el).attr('data-action'),
			gt_label = $(el).attr('data-label');

		// Category
		if (_gtrack.cat(el)) gt_cat += ":" + _gtrack.cat(el);

		// Action
		if (!gt_act) gt_act = $(el).prop('tagName').toLowerCase();
		gt_act = 'click:' + gt_act;

		_gtrack.track_event(gt_cat, gt_act, gt_label);
	}
	
	this.cat = function(element) {
		try {
			var count = 0, max = 99;
			while (element != document && count < max) {
				var parent = $(element).parents();
				if (parent.attr('data-category')) {
					return parent.attr('data-category'); 
				} else {
					element = parent; 
					count++; 
				}
			}
			return null;
		} catch(e) {return null;}
	}

	this.track_event = function(category, action, label) {
		if ( typeof category == 'undefined' || !category ) category = '';
		if ( typeof action == 'undefined' || !action ) action = '';
		if ( typeof label == 'undefined' || !label ) label = '';

		if (typeof ga != 'undefined' && app.config.env != 'dev') {
			ga('send', 'event', category, action, label);
		} else {
			console.log('GA Event:', category, action, label);
		}
	}


}
app['imageAdd'] = new function() {
	_imageAdd = this;
	
	this.templates = {
		'imgFile'		: '<input name="myfile" data-field="${dbId}" type="file" accept="image/*" capture="camera">',
		'userImage'		: '<img class="user-image" src="' + app.config.studentImagePath + '${userImg}?z=${rndNum}">',
	}
	
	this.template_data = {
		'uploadBtn': {
			'color'			: 'btn-default',
			'btnSize'		: 'btn-lg',
			'icon'			: 'fa-camera',
			'iconSize'		: 'fa-lg',
			'text'			: 'Add Photo',
			
		},
	}
	
	this.cacheBuster = function() {
		return Math.floor((Math.random()*100));
	}

	/*
	 * Add User Images
	 * Params:
	 * - user (obj)
	 * - appendTo (el)
	 */
	this.addUserImage = function(params) {
		var image = $.tmpl(_imageAdd.templates.userImage, $.extend({}, params.user, { rndNum: _imageAdd.cacheBuster() }) ),
			uploadBtn = $.tmpl(app.global.templates.button, _imageAdd.template_data.uploadBtn);

		// Add to DOM
		params['appendTo']
			.append(image)
			.append(uploadBtn);

		app.imageAdd.createUploadBtn({
			btnEl: uploadBtn,
			imgEl: image,
			user: params.user
		});
	}

	/*
	 * Create upload button for new user image
	 * Params:
	 * - btnEl (el)
	 * - imgEl (el)
	 * - user (obj)
	 */
	this.createUploadBtn = function(params) {
		var uploadBtn = $(params.btnEl),
			imgFile = $.tmpl(_imageAdd.templates.imgFile, params);

		// Add UI
		imgFile.insertAfter(uploadBtn);

		// Add Events
		uploadBtn.click(function() {
			imgFile.trigger('click');
		});

		imgFile.on("change", {
			imgEl: params.imgEl,
			user: params.user
		}, _imageAdd.gotPic);
	}

	/*
	 * Save uploaded user image
	 * Params:
	 * - imgEl (el)
	 * - user (obj)
	 */
	this.gotPic = function(e) {
		var file = event.target.files[0],
			imgEl = e.data.imgEl,
			params = e.data;

		if (file.type.indexOf("image/") > -1) {
			_imageAdd.saveUserImage({
				file	: file,
				imgEl	: params.imgEl,
				user	: params.user
			});
		}
	}

	/*
	 * Save uploaded user image
	 * Params:
	 * - file (file)
	 * - imgEl (el)
	 * - user (obj)
	 */
	this.saveUserImage = function(params) {
		var data = new FormData(),
			imgEl = params.imgEl,
			file = params.file,
			prevSrc = imgEl.data('prevsrc'),
			user = params.user;

		// Image
		if (file) {
			data.append('myfile', file);
			data.append('extension', app.global.fileExtension(file.name));
			data.append('id', user.id);
		} else {
			return false;
		}
		
		$.ajax({
			type: "POST",
			url: "backend/forms/student_field_update.php",
			data: data,
			dataType: 'json',
			processData: false,
			contentType: false
		})
		.done(function(response) {
			if (response.success == 'true') {
				var imgSrc = app.config.studentImagePath + response.value + "?z=" + _imageAdd.cacheBuster();

				imgEl.attr('src', imgSrc);
				params.user[response.field] = response.value;
				app.ls.setItem('user', app.data.user);

				app.global.alert({
					msg	:'Saved', 
					icon: 'fa-check-circle'
				});
			} else {
				app.ajaxError('Unable to save user.');
			}
		});
	}
};
app['online'] = new function() {
	_online = this;
	this.delay = 3000; // 30seconds
	this.status = true;
	
	this.init = function() {
		setInterval(function() {
			var prevStatus = _online.status,
				currStatus = _online.checkStatus();

			if (currStatus != prevStatus) {
				_online.toggleStatus(currStatus);
			}
		}, _online.delay)
	}
	
	this.toggleStatus = function(online) {
		app.global.els.body[online ? 'removeClass' : 'addClass']('offline');
		_online.status = online;
		console.log('Is Online:', online);
	}
	
	this.checkStatus = function() {
		// Handle IE and more capable browsers
		var xhr = new ( window.ActiveXObject || XMLHttpRequest )( "Microsoft.XMLHTTP" );
		var status;
		var server = window.location.hostname;
		if (window.location.port != '') server += ':'+window.location.port;

		// Open new request as a HEAD to the root hostname with a random param to bust the cache
		xhr.open( "HEAD", "//" + server + "/?rand=" + Math.floor((1 + Math.random()) * 0x10000), false );

		// Issue request and handle response
		try {
			xhr.send();
			return ( xhr.status >= 200 && xhr.status < 300 || xhr.status === 304 );
		} catch (error) {
			return false;
		}
	}

};
