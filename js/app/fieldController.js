app['fieldController'] = new function() {
	_fieldController = this;
	
	this.templates = {
		'input'			: '<input data-regex="${regex}" data-action="${gtAct}" name="${name}" value="${value}" data-field="${dbId}" data-valid="${validLength}" type="${inputType}" class="form-control" placeholder="${placeholder}" data-mask="${mask}">',
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
				validLength = $(this).attr('data-valid'),
				regex = $(this).attr('data-regex');

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
			if (regex) {
				var validRegex = new RegExp(regex),
					error = !(validRegex.test(val));
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
		console.log('*********');
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