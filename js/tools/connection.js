tools['connection'] = new function() {
	_connection = this;
	
	this.data = {};
	this.apis = {
		'getUserData'		: '_userDetails.php',
		'connectionList'	: '_connections.php',
		'connectUpdate'		: '_update.php',
		'userEidt'			: '_userEdit.php',
		'userDelete'		: '_userDelete.php'
	}

	this.els = {
		user_select 				: $('#user_select'),
		not_selected_table			: $('.not_selected_wrapper table'),
		selected_table				: $('.selected_wrapper table'),
		filter_tabs					: $('.filter-tabs'),
		connection_tabs				: $('.connection-tabs'),
		addStudentsBtn				: $('#add_selected_students'),
		removeStudentsBtn			: $('#remove_selected_students'),
		not_selected_selected_count	: $('#not_selected_selected_count'),
		selected_selected_count		: $('#selected_selected_count')
	}

	this.init = function() {
		// Get User Info
		_connection.data['userid'] = _connection.els['user_select'].val();
		_connection.getUserData();

		// Setup
		_connection.setupTabs();
		
		// Events
		_connection.els['user_select'].on('change', _connection.userSelect);
		_connection.els['addStudentsBtn'].click(_connection.addSelected);
		_connection.els['removeStudentsBtn'].click(_connection.removeSelected);
		$(window).overlay({show: false, delay: 250 });
	}
	
	this.getUserData = function() {
		$.ajax({
			url: _connection.apis.getUserData,
			data: {
				id: _connection.data['userid']
			}
		})
		.done(function(response) {
			response = $.parseJSON(response);
			console.log('response', response);

			_connection.data['user'] = response;
			_connection.hideTabs();
		});
	}
	
	this.hideTabs = function() {
		var isAdmin = Number(_connection.data.user.admin),
			isCaptain = Number(_connection.data.user.captain),
			isCoach = Number(_connection.data.user.coach),
			isCounselor = Number(_connection.data.user.counselor);

		if (isAdmin) { _tools.els.body.addClass('admin'); }
		else if (isCaptain) { _tools.els.body.addClass('captain'); }
		else if (isCoach) { _tools.els.body.addClass('coach'); }
		else if (isCounselor) { _tools.els.body.addClass('counselor'); }
	}

	
	this.userSelect = function() {
		var user = $(this).val();

		if (user.length > 0) {
			window.location.href = window.location.href.split('?')[0] + "?user=" + user;
		}
	}

	
	this.updateSelectedCount = function() {
		var availableIds = _connection['data']['activeTab']['available']['selectedIds'],
			selectedIds = _connection['data']['activeTab']['selected']['selectedIds'];
		
		_connection['data']['activeTab']['available']['selectCount'].text(availableIds.length);
		_connection['data']['activeTab']['selected']['selectCount'].text(selectedIds.length);
	}
	
	this.updateTableCount = function() {
		if (_connection['data']['activeTab']['available']['table']) {
			var availableRowCount = _connection['data']['activeTab']['available']['table'].fnSettings().fnRecordsTotal();
			_connection['data']['activeTab']['available']['totalCount'].text(availableRowCount);
		}

		if (_connection['data']['activeTab']['selected']['table']) {
			var selectedRowCount = _connection['data']['activeTab']['selected']['table'].fnSettings().fnRecordsTotal();
			_connection['data']['activeTab']['selected']['totalCount'].text(selectedRowCount);
		}
	}
	
	this.setupTabs = function() {
		// Connection tabs
		_connection.els['connection_tabs'].tabs();

		// Filter tabs
		_connection.els['filter_tabs'].tabs({
			activate: function(event, ui) {
				_connection.openFilterTab({
					tab: $(ui.newTab),
					panel: $(ui.newPanel)
				});
			},
			create: function(event, ui) {
				_connection.openFilterTab({
					tab: $(ui.tab),
					panel: $(ui.panel)
				});
			}
		});
	}
	
	/*
	 * Ajax call to get table data
	 */
	this.getTableData = function() {
		var ajaxTime= new Date().getTime();
		$.ajax({
			url: _connection.apis.connectionList,
			data: {
				'type'		: _connection['data']['activeTab']['type'],
				'filter'	: _connection['data']['activeTab']['filter'],
				'userid'	: _connection.data['userid']
			}
		})
		.done(function(response) {
			response = $.parseJSON(response);
			console.log('response', response);
			var totalTime = new Date().getTime()-ajaxTime;
			console.log('totalTime', totalTime);
			
			if (response.success == 'true') {
				// Available table
				tools.table.createTable({
					'data'			: response.available,
					'columns'		: response.columns,
					'paging'		: true,
					'prependTo'		: _connection['data']['activeTab']['available']['panel'],
					'dataObj'		: _connection['data']['activeTab']['available'],
					'selectToggle'	: true,
					'selectTableRows': true,
					'editModeToggle': true
				});
				

				// Selected table
				tools.table.createTable({
					'data'			: response.selected,
					'columns'		: response.columns,
					'paging'		: true,
					'prependTo'		: _connection['data']['activeTab']['selected']['panel'],
					'dataObj'		: _connection['data']['activeTab']['selected'],
					'selectToggle'	: true,
					'selectTableRows': true,
					'editModeToggle': true
				});
				
			}
		});
	}
	
	/*
	 * Setup selected filter tab
	 * params:
	 * - tab (element)
	 * - panel (element)
	 */
	this.openFilterTab = function(params) {
		// Remove previous tables for stable ui
		try {
			if (_connection['data']['activeTab']['available']['table']) {
				_connection['data']['activeTab']['available']['table'].fnDestroy();
				_connection['data']['activeTab']['available']['dataTable'].remove();
			}
			if (_connection['data']['activeTab']['selected']['table']) {
				_connection['data']['activeTab']['selected']['table'].fnDestroy();
				_connection['data']['activeTab']['selected']['dataTable'].remove();
			}
		} catch (err) {}
		
		
		// Active Tab
		_connection['data']['activeTab'] = new Object();
		_connection['data']['activeTab']['tab'] = params['tab'];
		_connection['data']['activeTab']['panel'] = params['panel'];
		_connection['data']['activeTab']['type'] = params['tab'].data('type');
		_connection['data']['activeTab']['filter'] = params['tab'].data('filter');
		
		// Available Panel
		_connection['data']['activeTab']['available'] = new Object();
		_connection['data']['activeTab']['available']['tab'] = params['panel'].find('.available-tab');
		_connection['data']['activeTab']['available']['table'] = null;
		_connection['data']['activeTab']['available']['dataTable'] = null;
		_connection['data']['activeTab']['available']['selectedIds'] = new Array();
		_connection['data']['activeTab']['available']['panel'] = params['panel'].find('.available-panel');
		_connection['data']['activeTab']['available']['totalCount'] = params['panel'].find('.available-total-count');
		_connection['data']['activeTab']['available']['selectCount'] = params['panel'].find('.selected-add-count');
		_connection['data']['activeTab']['available']['saveBtn'] = params['panel'].find('.btn-add');
		
		// Selected Panel
		_connection['data']['activeTab']['selected'] = new Object();
		_connection['data']['activeTab']['selected']['tab'] = params['panel'].find('.selected-tab');
		_connection['data']['activeTab']['selected']['table'] = null;
		_connection['data']['activeTab']['selected']['dataTable'] = null;
		_connection['data']['activeTab']['selected']['selectedIds'] = new Array();
		_connection['data']['activeTab']['selected']['panel'] = params['panel'].find('.selected-panel');
		_connection['data']['activeTab']['selected']['totalCount'] = params['panel'].find('.selected-total-count');
		_connection['data']['activeTab']['selected']['selectCount'] = params['panel'].find('.selected-remove-count');
		_connection['data']['activeTab']['selected']['saveBtn'] = params['panel'].find('.btn-remove');
		
		// Add filter tables
		_connection.getTableData();
		
		// Listen for selected updates
		EventManager.observe('RowSelectUpdate', _connection.updateSelectedCount);
		
		// Listen for updated table row count
		EventManager.observe('TableRowCount', _connection.updateTableCount);
		
		// Listen for row selection in Edit Mode
		EventManager.observe('RowSelect:edit', _connection.rowEdit);
		
		// Listen for row selection in Delete Mode
		EventManager.observe('RowSelect:delete', _connection.rowDelete);
		
		// Save Buttons
		_connection['data']['activeTab']['available']['saveBtn'].click({
			'action'	: 'add',
			'type'		: _connection['data']['activeTab']['type'],
			'ids'		: _connection['data']['activeTab']['available']['selectedIds'],
			'userid'	: _connection.data['userid']
		}, _connection.addSelected);

		_connection['data']['activeTab']['selected']['saveBtn'].click({
			'action'	: 'remove',
			'type'		: _connection['data']['activeTab']['type'],
			'ids'		: _connection['data']['activeTab']['selected']['selectedIds'],
			'userid'	: _connection.data['userid']
		}, _connection.removeSelected);
	}

	/* 
	 * Backend call to add connections
	 * params:
	 * - action (string)
	 * - ids (array)
	 * - type (string) student | user
	 * - userid (int)
	 */
	this.addSelected = function(e) {
		var params = e.data;
		if (!params) return false;
		if (!params['ids'] || params['ids'].length == 0) return false;

		$.ajax({
			url: _connection.apis.connectUpdate,
			type: "POST",
			data: params
		})
		.done(function(response) {
			response = $.parseJSON(response);
			console.log('response', response);

			if (response.success == '1') {
				_connection.moveTableRows({
					action: 'add',
					ids: response.students 
				});
			}
		});
	}

	/* 
	 * Backend call to remove connections
	 * params:
	 * - action (string)
	 * - ids (array)
	 * - userid (int)
	 */
	this.removeSelected = function(e) {
		var params = e.data;
		if (!params) return false;
		if (!params['ids'] || params['ids'].length == 0) return false;

		$.ajax({
			url: _connection.apis.connectUpdate,
			type: "POST",
			data: params
		})
		.done(function(response) {
			response = $.parseJSON(response);
			console.log('response', response);
			
			if (response.success == '1') {
				_connection.moveTableRows({
					action: 'remove',
					ids: response.students 
				});
			}
		});
	}
	
	/*
	 * params
	 * - action (string) add/remove
	 * - students (array) ids
	 */
	this.moveTableRows = function(params) {
		var tab = _connection['data']['activeTab'],
			from = (params.action == 'add' ? tab['available'] : tab['selected']),
			to = (params.action == 'add' ? tab['selected'] : tab['available']),
			toTableTbody = to['table'].find('tbody'),
			row_ids = params.ids;

		// Remove Filters
		from['table'].dataTable().fnFilter('');
		to['table'].dataTable().fnFilter('');

		// Loop through rows to find ones to move
		var fromRows = from['table'].find('tbody tr');
		$.each(fromRows, function(x, row) {
			var rowIndex = row._DT_RowIndex,
				rowData = from['table'].fnGetData(rowIndex),
				tableId = rowData[0];

			
			if ($.inArray(tableId, row_ids) >= 0) {
				// Clear selected id
				tools['table'].toggleSelectedIds({
					storage: from['selectedIds'],
					ids: [tableId],
					action: 'remove'
				});

				// Move rows
				var rowIndex = to['table'].fnAddData(rowData);
				from['table'].fnDeleteRow(row);
				EventManager.fire('TableRowCount');
			}
		})
		
		// Open tab and scroll to bottom
		to['tab'].trigger('click');
		to['dataTable'].scrollTop(to['dataTable'].prop('scrollHeight'));
	}
	
	
	this.rowEdit = function(params) {
		var data = params['data'],
			table = data['table'],
			cols = data['columns'],
			rowEl = params['row'],
			rowData = table.fnGetData(rowEl);

		// Create ui
		rowEl.addClass('ui-selected');
		var wrapper = $('<div class="edit-form"></div>');
		$.each(cols, function(x, col) {
			var dbId = col.title,
				inputGroup = $('<div class="input-group ' + dbId + '"></div>'),
				inputGroupAddon = $('<span class="input-group-addon">' + dbId + '</span>'),
				inputGroupField = $('<input type="text" data-col="' + dbId + '" class="valueEl form-control" value="' + rowData[x] + '">');

			inputGroup
				.append(inputGroupAddon)
				.append(inputGroupField);
			wrapper
				.append(inputGroup);
		});

		// Show dialog
		wrapper.dialog({
			modal: true,
			width: 500,
			title: 'Edit User',
			show: {
				effect: "size",
				duration: 250
			},
			close: function() {
				wrapper.dialog('destroy');
				setTimeout(function() {
					rowEl.removeClass('ui-selected');
				}, 500);
			},
			buttons: {
				Cancel: function() {
					wrapper.dialog('close');
				},
				Save: function() {
					var valueEls = wrapper.find('.valueEl'),
						data = {};

					// Scrape ui for data
					$.each(valueEls, function(x, valueEl) {
						var col = $(valueEl).data('col'),
							val = $(valueEl).val();
						data[col] = val;
					});

					// Save data
					_connection.editRowSave({
						data: data,
						row: rowEl,
						table: table,
						cb: function() {
							wrapper.dialog('close');
						}
					})
				}
			}
		});
	}
	
	this.editRowSave = function(params) {
		var user = params['data'],
			row = params['row'],
			table = params['table'],
			cb = params['cb'];

		$.ajax({
			url: _connection.apis.userEidt,
			data: {
				type: _connection['data']['activeTab']['type'],
				user: user
			}
		})
		.done(function(response) {
			response = $.parseJSON(response);
			console.log('response', response);

			// Create array
			var ary = [];
			$.each(response, function(k,v) {
				ary.push(v);
			});

			// Update table
			table.fnUpdate(ary, row);
			if (cb) cb();
			row.effect('pulsate', {}, 500);
		});
	}
	
	this.rowDelete = function(params) {
		var data = params['data'],
			table = data['table'],
			rowEl = params['row'],
			rowId = rowEl.find('.id').text();

		var response = false;
		if (confirm("Delete this user?") == true) {
			response = true;
		}

		if (!response || !rowId) { return true; }
		$.ajax({
			url: _connection.apis.userDelete,
			data: {
				type: _connection['data']['activeTab']['type'],
				id: rowId
			}
		})
		.done(function(response) {
			response = $.parseJSON(response);
			console.log('response', response);
		
			if (response.status) {
				rowEl.effect('pulsate', {}, 500, function() {
					table.fnDeleteRow(rowEl);
				});
			}
		});
	}

}();