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
			'href'			: '/export',
			'iconR'			: 'fa-angle-right',
			'iconSize'		: 'fa-lg'
		},
		'upload': {
			'color'			: 'btn-success',
			'btnSize'		: 'btn-lg',
			'classes'		: 'shadow marginBottom10',
			'acls'			: 'acl-admin',
			'text'			: 'UPLOAD USERS',
			'href'			: '/upload',
			'iconR'			: 'fa-angle-right',
			'iconSize'		: 'fa-lg'
		},
		'connect': {
			'color'			: 'btn-success',
			'btnSize'		: 'btn-lg',
			'classes'		: 'shadow marginBottom10',
			'acls'			: 'acl-connect',
			'text'			: 'ADD CONNECTION',
			'href'			: 'connect/',
			'iconR'			: 'fa-angle-right',
			'iconSize'		: 'fa-lg'
		},
		'studentEdit': {
			'color'			: 'btn-primary',
			'btnSize'		: 'btn-lg',
			'classes'		: 'shadow marginBottom10',
			'acls'			: '',
			'text'			: 'MY STUDENTS',
			'iconR'			: 'fa-angle-right',
			'iconSize'		: 'fa-lg'
		},
		'eventAdd': {
			'color'			: 'btn-primary',
			'btnSize'		: 'btn-lg',
			'classes'		: 'shadow marginBottom10',
			'acls'			: '',
			'text'			: 'I MET WITH A STUDENT',
			'iconR'			: 'fa-angle-right',
			'iconSize'		: 'fa-lg'
		},
		'scheduleAdd': {
			'color'			: 'btn-primary',
			'btnSize'		: 'btn-lg',
			'classes'		: 'shadow marginBottom10',
			'acls'			: 'hidden',
			'text'			: 'SCHEDULE FOLLOW UP',
			'iconR'			: 'fa-angle-right',
			'iconSize'		: 'fa-lg'
		},
		'scheduleList': {
			'color'			: 'btn-primary',
			'btnSize'		: 'btn-lg',
			'classes'		: 'shadow marginBottom10',
			'acls'			: 'hidden',
			'text'			: 'UPCOMING MEETINGS',
			'iconR'			: 'fa-angle-right',
			'iconSize'		: 'fa-lg'
		},
		'offlineInfoBtn'	: {
			'text'			: 'Learn More',
			'color'			: 'btn-warning',
			'classes'		: 'width_50 shadow'
		},
		'offLineMsg'		: {
			'text'			: 'You have unsaved data!'
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
		app.header.addHelp();
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