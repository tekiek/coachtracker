tools['dataExport'] = new function() {
	_dataExport = this;
	this.table_col_values_src = "data_export_table_search.php";
	this.fetch_data_src = "data_export_get_data.php";

	this.data = {
		filters: [],
		cols: []
	};

	this.templates = {
		div			: '<div class="${classes}"></div>',
		list_group	: '<ul class="list-group ${classes}"</ul>',
		list_item	: '<li class="list-group-item ${classes}">${text}</li>',
		badge		: '<span class="badge">${text}</span>',
		icon		: '<i class="fa ${icon}"></i>',
		input		: '<input type="${type}" class="form-control" placeholder="${placeholder}">',
		table		: {
			table	: '<table class="table table-striped"></table>',
			thead	: '<thead></thead>',
			row		: '<tr></tr>',
			h_col	: '<th>${data}</th>',
			tbody	: '<tbody></tbody>',
			d_col	: '<td>${data}</td>'
		}
	}
	
	this.template_data = {
		filter_search: {
			type: 'text',
			placeholder: 'Search...'
		}
	}
	
	this.els = {
		table_col_list	: $('div#table_col_list'),
		data_col_list	: $('div#data_col_list'),
		students_cols 	: $('#students_cols'),
		events_cols 	: $('#events_cols'),
		users_cols 		: $('#users_cols'),
		data_cols		: $('#data_cols'),
		filter_cols		: $('#filter_cols'),
		col_list		: $('.col_list'),
		get_data_btn	: $('#show_data'),
		data_table		: $('#data_table')
	}

	this.init = function() {
		_dataExport.accordions();
		_dataExport.sortable();
		_dataExport.getDataBtn();
	}
	
	this.accordions = function() {
		_dataExport.els['table_col_list'].accordion();
		_dataExport.els['data_col_list'].accordion();
	}
	
	this.getDataBtn = function() {
		_dataExport.els['get_data_btn'].click(function() {
			console.log('click')
			_dataExport.fetchData();
		})
	}
	
	this.sortable = function() {
		// Add Sortable
		_dataExport.els['col_list']
			.sortable({
				start: function(e, ui) {
					$(ui.item[0]).data('previndex', (ui.item.index() + 1));
				},
				connectWith: ".col_list",
				placeholder: "ui-state-highlight",
				cancel: ".ui-state-disabled"
			})
			.disableSelection();
			
		// Filter Drop
		_dataExport.els['filter_cols'].on("sortreceive", function(event, ui) {
			var list_item = $(ui.item[0]),
				table = list_item.data('table'),
				col = list_item.data('col');

			_dataExport.filterDialog({
				'el'		: $(ui.item[0]),
				'sender'	: $(ui.sender[0]),
				'receiver'	: $(this),
				'table'		: table,
				'col'		: col
			});
		});
		
		// Data Col Drop
		_dataExport.els['data_cols'].on("sortreceive", function(event, ui) {
			var list_item = $(ui.item[0]),
				table = list_item.data('table'),
				col = list_item.data('col');

			_dataExport.addToDataCol({
				'el'		: $(ui.item[0]),
				'sender'	: $(ui.sender[0]),
				'receiver'	: $(this),
				'table'		: table,
				'col'		: col
			});
		});

	}
	
	this.fetchData = function() {
		// Validate Data Fetch
		if (dataExport.data.cols.length == 0) {
			_dataExport.lock_screen({ 
				show: true,
				msg: 'No Data Found',
				delay: 1000 
			});
			return false;
		} else {
			_dataExport.lock_screen({show: true});
		}
		
		// Get column data
		$.ajax({
			url: _dataExport.fetch_data_src,
			data: _dataExport.data
		})
		.done(function(response) {
			if (typeof response != 'undefined') {
				response = $.parseJSON(response);
				var data = response['data'];

				// Add Data Table
				var table = _dataExport.buildTable({
					header: dataExport.data['cols'], 
					data: data
				});
				_dataExport.els['data_table']
					.empty()
					.append(table)
					.show();

				// Scroll to bottom of page
				window.scrollTo(0,document.body.scrollHeight);

				// Unlock Screen	
				_dataExport.lock_screen({
					show: false,
					delay: 250
				});
			} else {
				_dataExport.lock_screen({ 
					show: true,
					msg: 'No Data Found',
					delay: 1000 
				});
			}
		});
	}
	
	this.buildTable = function(params) {
		if (!params) params = new Object();
		if (!params['header']) params['header'] = new Object();
		if (!params['data']) params['data'] = new Object();
		
		var table_templates = _dataExport.templates['table'],
			table = $.tmpl(table_templates['table']),
			thead = $.tmpl(table_templates['thead']),
			row = $.tmpl(table_templates['row']),
			tbody = $.tmpl(table_templates['tbody']);

		// HEADER
		var header_row = row.clone();
		$.each(params['header'], function(i, header_col) {
			var header_col = $.tmpl(table_templates['h_col'], {
				data: header_col['col']
			})
			header_row.append(header_col);
		})
		thead.append(header_row);

		// BODY
		$.each(params['data'], function(i, data_row) {
			var body_row = row.clone();
			$.each(data_row, function(x, data_col) {
				var body_col = $.tmpl(table_templates['d_col'], {
					data: data_col
				})
				body_row.append(body_col);
			})
			tbody.append(body_row);
		});

		// BUILD TABLE
		table
			.append(thead)
			.append(tbody);

		return table;
	}
	
	this.lock_screen = function(params) {
		if (typeof params != "object") params = new Object();
		if (!params['show']) params['show'] = false;
		if (!params['msg']) params['msg'] = '<i class="fa fa-spinner fa-spin fa-2x"></i>';
		if (!params['delay']) params['delay'] = 0;
		
		if (params['show']) {
			$.blockUI({ 
				message: '<h3>' + params['msg']  + '</h3>'
			});
			if (params['delay']) {
				_dataExport.lock_screen({
					show: false,
					delay: params['delay']
				})
			}
		} else {
			setTimeout(function() {
				$.unblockUI();
			}, params['delay'])
		}
	}
	
	/*
	 * parms:
	 *  - list_item (object) 
	 * 		- classes
	 * 		- text
	 * 		- cb
	 *  - badges (array)
	 * 		- text
	 * 		- icon
	 * 		- cb
	 * 	- close_button (boolean)
	 */
	this.buildListItem = function(params) {
		if (typeof params != 'object') params = new Object();
		if (!params['list_item']) params['list_item'] = new Object();
		if (!params['badges']) params['badges'] = new Object();
		if (!params['close_button']) params['close_button'] = false;

		var list_item_el = $.tmpl(_dataExport.templates['list_item'], params['list_item']);

		// Add close button?
		if (params['close_button']) {
			var close_btn = _dataExport.buildBadge({
				icon: 'fa-times',
				cb: 'remove'
			});
			close_btn.click(function() {
				list_item_el.fadeOut(500, function() {
					list_item_el.remove();
					if (params['close_button_cb']) params['close_button_cb']();
				})
				
			});
			list_item_el.append(close_btn);
		}

		// Add badges
		$.each(params['badges'], function(i, badge) {
			list_item_el.append(_dataExport.buildBadge(badge));
		});

		return list_item_el;
	}
	
	/*
	 * parms:
	 *  - badge (object)
	 * 		- text
	 * 		- icon
	 */
	this.buildBadge = function(params) {
		var badge_el = $.tmpl(_dataExport.templates['badge'], params),
			badge_icon = $.tmpl(_dataExport.templates['icon'], params);
		
		badge_el.append(badge_icon);
		return badge_el;
	}
	
	
	// *************** DATA COL LIST ****************
	this.addToDataCol = function(params) {
		
		_dataExport.returnColToSender(params);
		
		var col_data = {
			table	: params['table'],
			col		: params['col']
		};
		_dataExport.data['cols'].push(col_data);
		
		// Update col list
		_dataExport.updateColsList();
	}
	
	this.updateColsList = function() {
		dataExport.els['data_cols'].empty();
		$.each(_dataExport.data['cols'], function(i, col) {
			
			// Create list element
			var list_item_el = _dataExport.buildListItem({
				list_item: {
					text: col['table'] + " [" + col['col'] + "]",
					classes: 'ui-state-disabled'
				},
				close_button: true,
				close_button_cb: function() {
					_dataExport.data['cols'].splice(i,1);
					_dataExport.updateColsList();
				}
			});

			// Add to UI
			_dataExport.els['data_cols'].append(list_item_el);
		});
		
	}
	
	
	


	/*
	 * parms:
	 *  - el
	 *  - sender (optional)
	 *  - receiver (optional)
	 *  - table
	 *  - col
	 *  - edit_index (optional)
	 */
	this.filterDialog = function(params) {
			// Lock screen and return list element
			_dataExport.lock_screen({show: true});
			if (params['sender']) _dataExport.returnColToSender(params);
			
			// Get column data
			$.ajax({
				url: _dataExport.table_col_values_src,
				data: {
					'table'	: params['table'],
					'col'	: params['col']
				}
			})
			.done(function(response) {
				_dataExport.lock_screen({ show: false });
				response = $.parseJSON(response);
				
				// Append response to params
				params = $.extend({}, params, response);
				console.log('PARAMS', params);

				if (response.values.length > 0) {
					// Build Filter UI
					var filter_ui = _dataExport.buildFilterUI(params);

					filter_ui.dialog({
						title: "Select A Filter Value",
						modal: true,
						buttons: {
							Ok: function() {
								var filter_list_values = _dataExport.getFilterValues(filter_ui);

								if (filter_list_values.length > 0) {
									// Store filter data
									var filter_data = {
										table	: params['table'],
										col		: params['col'],
										filters	: filter_list_values
									};
									if (_dataExport.data['filters'][params['edit_index']]) {
										_dataExport.data['filters'][params['edit_index']] = filter_data;
									} else {
										_dataExport.data['filters'].push(filter_data);
									}

									// Update filter list
									_dataExport.updateFilterList();

									$(this).dialog('destroy').remove();
								}
							},
							Cancel: function() {
								$(this).dialog('destroy').remove();
							}
						}
					});
				} else {
					_dataExport.lock_screen({ 
						show: true,
						msg: 'No data to filter',
						delay: 1000 
					});
				}
			});

	}
	
	this.updateFilterList = function() {
		dataExport.els['filter_cols'].empty();
		$.each(_dataExport.data['filters'], function(i, filter) {

			// Create badges from filter values
			var badges = new Array();
			$.each(filter['filters'], function(x, badge) {
				badges.push({
					text: badge
				})
			})
			
			// Create filter element
			var list_item_el = _dataExport.buildListItem({
				list_item: {
					text: filter['table'] + " [" + filter['col'] + "]",
					classes: 'ui-state-disabled'
				},
				badges: badges,
				close_button: true,
				close_button_cb: function() {
					_dataExport.data['filters'].splice(i,1);
					_dataExport.updateFilterList();
				}
			})
			
			// Double click to edit
			list_item_el.dblclick(function() {
				var params = $.extend({}, {'edit_index': i}, _dataExport.data['filters'][i]);
				_dataExport.filterDialog(params);
			})

			// Add to UI
			_dataExport.els['filter_cols'].append(list_item_el);
		});
		
	}
	
	// Get filter values from list element
	this.getFilterValues = function(list) {
		var filter_list_els = list.find('.selected-filter'),
			filter_list = new Array();

		$.each(filter_list_els, function(i, el) {
			filter_list[i] = $(el).text();
		});

		return filter_list;
	}
	
	this.returnColToSender = function(params) {
		params['sender'].prepend(params['el']);
	}

	/*
	 * parms:
	 *  - structure: Table col structure
	 *  - selected_filters: append filters to list
	 *  - values: predefined values that can be filtered
	 */
	this.buildFilterUI = function(params) {
		var ui_wrapper = $.tmpl(_dataExport.templates['div'], { classes: 'filter-wrapper'} );
		
		// String search
		if (params['structure'].toLowerCase().indexOf('varchar') >= 0) {
			var search_field = $.tmpl(_dataExport.templates['input'], _dataExport.template_data['filter_search']),
				filter_list = $.tmpl(_dataExport.templates['list_group'], { classes: 'filter-list'} );
			
			// Add passed filters to list
			if (params['filters']) {
				$.each(params['filters'], function(i, filter) {
					_dataExport.addFilterToList({
						'filter': filter,
						'list' : filter_list
					});
				})
			}
			
			// Filter search
			search_field.autocomplete({
				source: params['values'],
				select: function(event, ui) {

					// add filter to list
					_dataExport.addFilterToList({
						'filter': ui.item.value,
						'list' : filter_list
					});

					// Clear search field
					this.value = "";
					return false;
				}
			})

			// Add elements
			ui_wrapper.append(search_field);
			ui_wrapper.append(filter_list);
		}
		
		return ui_wrapper;
	}
	
	/* 
	 * Create list item and append to filters list
	 * params:
	 *  - filter (string)
	 *  - list (element)
	 */
	this.addFilterToList = function(params) {
		var list_item_params = {
			list_item: {
				text	: params['filter'],
				classes	: 'selected-filter'
			},
			close_button: true
		};

		var filter_value_el = _dataExport.buildListItem(list_item_params);
		params['list'].append(filter_value_el);
	}

	

}();