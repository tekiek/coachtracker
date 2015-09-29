app['signature'] = new function() {
	var _eventSignature = this;
	this.els = {};
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
			'iconSize'		: 'fa-lg',
			'text'			: 'SAVE'
		},
		'cancelBtn': {
			'color'			: 'btn-danger width_50',
			'btnSize'		: 'btn-lg',
			'classes'		: 'width_50 right',
			'iconSize'		: 'fa-lg',
			'text'			: 'Cancel'
		}
	}

	this.init = function() {
		_eventSignature.getEls();
		_eventSignature.els.parent.empty();
		_eventSignature.addSignature();
		_eventSignature.open();
	}
	
	this.getEls = function() {
		_eventSignature.els = {
			parent: $("div#event-signature")
		}
	}
	
	this.open = function() {
		_eventSignature.data.scrollPos = $(window).scrollTop();
		window.scrollTo(0, 0);

		app.global.dialogConfirm({
			msg: _eventSignature.els.signatureWrapper,
			// width: ($(window).width() > 600 ? 600 : $(window).width()),
			height: ($(window).height() / 2),
			width: $(window).width(),
			//height: $(window).height(),
			className: 'signatureDialog',
			modal: true,
			animate: true,
			transition: 'slideInUp',
			transitionSpeed: 'fast',
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