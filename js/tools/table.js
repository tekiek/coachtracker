tools['table'] = new function() {
	_table = this;
	
	this.templates = {
		div			: '<div class="${classes}"></div>',
		modeOption	: '<input type="radio" id="${id}" name="${name}" ${checked}><label for="${id}">${text}</label>'
	}
	
	/*
	 * Create a data table and add DOM
	 * Params:
	 * - data (array)
	 * - columns (array)
	 * - prependTo (element)
	 * - dataObj (obj)
	 * - selectToggle (boolean) select all / select none
	 * - selectTableRows (boolean) select rows
	 */
	this.createTable = function(params) {
		if (typeof params == 'undefined') return false;
		if (!params['data']) params['data'] = new Array();
		if (!params['columns']) params['columns'] = new Array();
		if (!params['selectToggle']) params['selectToggle'] = false;
		if (!params['selectTableRows']) params['selectTableRows'] = false;
		if (!params['editModeToggle']) params['editModeToggle'] = false;
		if (!params['export']) params['export'] = false;
		if (!params['export']) params['export'] = false;
		if (!params['colLabels']) params['colLabels'] = params['columns'];

		// Clean columns
		var columns = new Array();
		$.each(params['columns'], function(x, col) {
			columns.push({
				'title': params['colLabels'][x],
				'class': params['colLabels'][x],
			});
		});

		// Clean rows
		var data = new Array();
		$.each(params['data'], function(x, row) {
			var row_data = new Array();
			$.each(params['columns'], function(x, col) {
				row_data.push(row[col]);
			});
			data.push(row_data);
		});
		
		// Create table
		var table = $('<table class="table table-striped table-bordered order-column"></table>'),
			wrapper = $('<div></div>');
		wrapper.append(table);

		table.dataTable({
			"order"				: params['sort'] ? params['sort'] : [],
			'data'				: data,
			'columns'			: columns,
			'paging'			: params['paging'],
			'ordering'			: true,
			'info'				: false,
			'jQueryUI'			: false,
			'dom'				: (params['export'] ? 'T<"clear">lfrtip' : '<"clear">lfrtip'),
			'tableTools'		: (params['export'] ? {
				'sSwfPath':'copy_csv_xls_pdf.swf', 
				'aButtons': [
					{
						'sExtends': 'csv', 
						'sFileName': 'Events.csv'
					},
					{
						'sExtends': 'xls', 
						'sFileName': 'Events.xls'
					},
					{
						'sExtends': 'print'
					},
					{
						'sExtends': 'pdf', 
						'sFileName': 'Events.pdf'
					},
				]
			} : ''),
			fnPreDrawCallback	: function() {
				//$(window).overlay({ show: true });
			},
			'fnDrawCallback'	: function() {
				//$(window).overlay({show: false, delay: 250 });
			},
			'fnInitComplete'	: function() {
				// Add to ui
				if (params['dataObj']) {
					params['dataObj']['table'] = table;
					params['dataObj']['dataTable'] = wrapper;
					params['dataObj']['columns'] = columns;
				}
				params['prependTo'].prepend(wrapper);
				
				// Add column sorting events
				_table.columnSort(params['dataObj']);
				
				// Add select & unselect
				if (params['selectToggle']) _table.addSelectToggle(params['dataObj']);
				
				// Add row selection
				if (params['selectTableRows']) _table.selectTableRows(params['dataObj']);
				
				// Toggle Modes
				if (params['editModeToggle']) _table.modeToggle(params['dataObj'], params['editModeToggle']);
				
				// Fix Search
				_table.searchField(params['dataObj']);
				
				// Set table row count
				EventManager.fire('TableRowCount');
				
				// Callback
				if (params['cb']) params['cb']();
			}
		});
	}
	
	/*
	 * Add events to column sorting
	 * params:
	 * - table (element)
	 * - storageId (string) selected | available
	 */
	this.columnSort = function(params) {
		var cols = params['table'].find('thead th');
		
		cols.click(function() {
			$(window).overlay({
				show: true, 
				delay: 250 
			});
		})
	}
	
	/*
	 * Add table row selector
	 * params:
	 * - table (element)
	 * - storageId (string) selected | available
	 */
	this.selectTableRows = function(params) {
		var tableBody = params['table'];
		var options = {
			filter: 'tbody tr',
			stop: function() {
				EventManager.fire('RowSelectUpdate');
			},
			selected: function(event, ui) {
				var rowIndex = ui.selected._DT_RowIndex,
					rowData = params['table'].fnGetData(rowIndex),
					tableId = rowData[0];
	
				_table.toggleSelectedIds({
					storage: params['selectedIds'],
					ids: [tableId],
					action: 'add'
				});
			},
			unselected: function(event, ui) {
				var rowIndex = ui.unselected._DT_RowIndex,
					rowData = params['table'].fnGetData(rowIndex),
					tableId = rowData[0];
	
				_table.toggleSelectedIds({
					storage: params['selectedIds'],
					ids: [tableId],
					action: 'remove'
				});
			}
		}
		
		tableBody.selectable(options);
	}
	
	/*
	 * Add or Remove selected Ids
	 * Params:
	 * - storage (array)
	 * - ids (array)
	 * - action (string) add/remove
	 */
	this.toggleSelectedIds = function(params) {
		$.each(params['ids'], function(x, id) {
			id = Number(id);
			if (params['action'] == 'add') {
				if ($.inArray(id, params['storage']) < 0) params['storage'].push(id);
			}
			if (params['action'] == 'remove') {
				if ($.inArray(id, params['storage']) >= 0) params['storage'].splice($.inArray(id, params['storage']), 1);
			}
			EventManager.fire('RowSelectUpdate');
		})
	}
	
	this.searchField = function(params) {
		var table = params['table'],
			dataTable = params['dataTable'],
			searchEl = dataTable.find('input[type="search"]');
		
		searchEl	
			.unbind()
			.keydown(function(event){
				if (event.which == 13) {
					table.fnFilter($(this).val());
				}
			})
	}
	
	this.modeToggle = function(params, editModeToggle) {
		var table = params['table'],
			dataTable = params['dataTable'];
			tableId = table.attr('id'),
			searchEl = dataTable.find('input[type="search"]');

		// Create UI
		var toggleName = tableId + 'modeToggle',
			toggleWrapper = $.tmpl(_table.templates.div, {
				classes: 'table-mode-toggle'
			}),
			addToggle = $.tmpl(_table.templates.modeOption, {
				text: 'Add',
				id: tableId + 'addRadio',
				name: toggleName,
				checked: 'checked'
			}),
			editToggle = $.tmpl(_table.templates.modeOption, {
				text: 'Edit',
				id: tableId + 'editRadio',
				name: toggleName
			}),
			deleteToggle = $.tmpl(_table.templates.modeOption, {
				text: 'Delete',
				id: tableId + 'deleteRadio',
				name: toggleName
			});

		if ($.inArray('add', editModeToggle) > -1) toggleWrapper.append(addToggle);
		if ($.inArray('edit', editModeToggle) > -1) toggleWrapper.append(editToggle);
		if ($.inArray('delete', editModeToggle) > -1) toggleWrapper.append(deleteToggle);
		toggleWrapper.buttonset();
		

		searchEl
			.after(toggleWrapper);

		// Add events
		addToggle.click(function() {
			_table.modeToggleSelect({
				'table'			: table,
				'mode'			: 'add',
				'disableSelect'	: false,
				'params'		: params,
			});
			return false;
		});
		
		editToggle.click(function() {
			_table.modeToggleSelect({
				'table'			: table,
				'mode'			: 'edit',
				'disableSelect'	: true,
				'params'		: params,
			});
			return false;
		});
		
		deleteToggle.click(function() {
			_table.modeToggleSelect({
				'table'			: table,
				'mode'			: 'delete',
				'disableSelect'	: true,
				'params'		: params,
			});
			return false;
		});
		
		
		table.on('click', 'tr', function() {
			var mode = table.attr('data-mode');

			EventManager.fire('RowSelect:' + mode, {
				row: $(this),
				data: params
			});
			return false;
		})
	}

	/*
	 * Toggle when mode is selected
	 * params:
	 * - table (element)
	 * - newMode (string)
	 * - disableSelect (boolean) toggle selectable
	 * - params (obj) 
	 */
	this.modeToggleSelect = function(params) {
		var table = params['table'],
			newMode = params['mode'],
			currMode = table.attr('data-mode'),
			disableTableSelect = params['disableSelect'];

		// Selected current mode
		if (newMode == currMode) { return false; }

		$(window).overlay({ 
			show: true,
			cb: function() {
				// Need to wrap in try/catch to avoid errors 
				try {
					var isTableSelectDisabled = table.selectable("option", "disabled");
					if (disableTableSelect != isTableSelectDisabled) {
						table.selectable("option", "disabled", disableTableSelect);
					}
				} catch (err) {  }
				_table.unselectAll(params['params']);
				table.attr('data-mode', newMode);
			}
		});
	}
	
	/*
	 * Add Select All | Unselect All Toggle
	 * params:
	 * - dataTable (element)
	 * - storageId (string) selected | available
	 */
	this.addSelectToggle = function(params) {
		params['searchField'] = params['dataTable'].find('input[type="search"]');
		params['selectAll'] = $('<a class="select-toggle">Select All</a>');
		params['unselectAll'] = $('<a class="select-toggle">Unselect All</a>');
		params['selectBreak'] = $('<span class="select-break"> | </span>');

		// Add UI
		params['searchField']
			.after(params['unselectAll'])
			.after(params['selectBreak'])
			.after(params['selectAll']);

		// Add Events
		params['selectAll'].click(function() {
			_table.selectAll(params);
		});
		params['unselectAll'].click(function() {
			_table.unselectAll(params);
		});
	}
	
	this.selectAll = function(params) {
		var visibleRows = params['table'].find('tbody tr:visible');
		$.each(visibleRows, function(x, row) {
			var rowData = params['table'].fnGetData(this),
				tableId = rowData[0];
			_table.toggleSelectedIds({
				storage: params['selectedIds'],
				ids: [tableId],
				action: 'add'
			});
		});
		visibleRows.addClass('ui-selected');
	}
	
	this.unselectAll = function(params) {
		var visibleRows = params['table'].find('tbody tr.ui-selected:visible');
		$.each(visibleRows, function(x, row) {
			var rowData = params['table'].fnGetData(this),
				tableId = rowData[0];
			_table.toggleSelectedIds({
				storage: params['selectedIds'],
				ids: [tableId],
				action: 'remove'
			});
		});
		visibleRows.removeClass('ui-selected');
	}

}();