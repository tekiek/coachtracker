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
				<i class="fa ${iconR} ${iconSize} right"></i>\
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
		'listGroup'	: '<div class="list-group ${classes}"></div>',
		'listItem'	: '<a href="#" class="list-group-item"></a>',
		'js' 		: '<script type="text/javascript" src="${src}"></script>',
		'css'		: '<link rel="stylesheet" type="text/css" href="${src}" />',
		'jumbo'		: '<div class="jumbotron"></div>'
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