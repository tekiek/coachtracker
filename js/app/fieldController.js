app['fieldController'] = new function() {
	_fieldController = this;
	
	this.getFields = function(fields) {
		return jQuery.extend(true, {}, fields);
	}
	
	this.createField = function(fieldData) {
		var fieldType = fieldData['type'],
			templates = app.templates;

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
				fieldEl.append(optionEl);
			});
			if (fieldData['value']) fieldEl.val(fieldData['value']);
			
			
			fieldEl.find('input[type=checkbox]').click(function() {
				var _optionElId = $(this).attr('id');

				if (fieldData.maxLength) {
					var selectedEls = fieldEl.find('input[type=checkbox]:checked'),
						selectedCount = selectedEls.length;

					if (selectedCount > fieldData.maxLength) {
						$.each(selectedEls, function(i, el) {
							var _elId = $(el).attr('id');
							
							if (_elId != _optionElId) {
								$(el).attr('checked', false);
								return false;
							}
						})
					}
					$(this).attr('checked', true);
				}
			})
		}

		// Add autocomplete?
		if (fieldData['autocomplete']) {
			_fieldController.autoComplete({
				el: fieldEl,
				uri: fieldData['autocomplete']
			});
		}
		
		// Default Timestamp to current time
		if (fieldData['inputType'] == 'pickadate') {
			// Add current date
			$(fieldEl).val(new Date().toDateInputValue());
			
			// Add datepicker
			$(fieldEl).one('click', function() {
				$(fieldEl).pickadate({
					clear: '',
					format: 'yyyy-mm-dd',
					onClose: function() {
						var pos = $(fieldEl).offset().top;
						window.scrollTo(pos, 0);
					}
				})
			})
			
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

		var templates = app.templates,
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
		
		if (!isValid) {
			$('html, body').animate({
				scrollTop: $(".has-error").offset().top
			}, 500);
		}
		
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