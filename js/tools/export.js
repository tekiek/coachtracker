app['dataExport'] = new function() {
	_dataExport = this;
	this.els = {};
	this.data = {
		type: null,
		table: null,
		editModeToggle: ['off', 'delete'],
		dates: {
			from: null,
			to: null
		}
	};

	this.apis = {
		'events'		: '_getData.php',
		'signatures'	: '_getData.php',
		'emailBlast'	: '_getData.php',
		'eventDelete'	: '_eventDelete.php'
	}

	this.init = function() {
		_dataExport.getEls();
		
		// Listen for row selection in Delete Mode
		EventManager.observe('RowSelect:delete', _dataExport.rowDelete);
		
		// Listen for row selection in Edit Mode
		EventManager.observe('RowSelect:edit', _dataExport.rowEdit);
		
		// Setup
		app.libs.waitForLib({
			lib: 'jqueryui',
			cb: function() {
				_dataExport.setupTabs();
				_dataExport.datePicker();
				_dataExport.els.content.show();
			}
		});
	}
	
	this.getEls = function() {
		_dataExport.els = {
			'content': $('#content'),
			'fromDate': $('#date-picker-from'),
			'toDate': $('#date-picker-to'),
			'tableWrapper': $('#table-wrapper'),
			'tableType': $('#table-type'),
			'tableTabs': $('#tableTabs')
		}
	}
	
	this.setupTabs = function() {
		_dataExport.els.tableTabs.tabs({
			activate: function(event, ui) {
				_dataExport.data.type = $(ui.newTab).data('table');
				_dataExport.getTableData();
			},
			create: function(event, ui) {
				_dataExport.data.type = $(ui.tab).data('table');
				_dataExport.getTableData();
			}
		});
	}

	this.datePicker = function() {
		var today = new Date(),
			lastMonth = function() { 
				var d = new Date(); 
				d.setMonth(d.getMonth() - 1); 
				return d; 
			}

		_dataExport.els.fromDate
			.datepicker({
				changeMonth: true,
				maxDate: 0,
				onClose: function(selectedDate) {
					if (!selectedDate) selectedDate = 0;
					if (selectedDate != _dataExport.data.dates.from) {
						_dataExport.data.dates.from = selectedDate;
						_dataExport.els.toDate.datepicker('option', 'minDate', selectedDate);
						_dataExport.getTableData();
					}
				}
			})
			.datepicker('setDate', lastMonth());
		_dataExport.data.dates.from = _dataExport.els.fromDate.val();

		_dataExport.els.toDate
			.datepicker({
				changeMonth: true,
				maxDate: 0,
				onClose: function(selectedDate) {
					if (!selectedDate) selectedDate = 0;
					if (selectedDate != _dataExport.data.dates.to) {
						_dataExport.data.dates.to = selectedDate;
						_dataExport.els.fromDate.datepicker('option', 'maxDate', selectedDate);
						_dataExport.getTableData();
					}
				}
			})
			.datepicker('setDate', today);
		_dataExport.data.dates.to = _dataExport.els.toDate.val();
	}
	
	this.getTableData = function() {
		var tableType = _dataExport.data.type,
			tableWrapperEl = $('#table-wrapper-' + tableType),
			params = {
				user: _dataExport.data.userId,
				fromDate: _dataExport.els.fromDate.val(),
				toDate: _dataExport.els.toDate.val(),
				table: tableType
			}

		$.ajax({
			url: _dataExport.apis[tableType],
			data: params
		})
		.done(function(response) {
			response = $.parseJSON(response);
			var exportBtns = _dataExport.getExportButtons();

			tableWrapperEl.empty();
			app.table.createTable({
				'sort'			: (response.sort ? [[response.sort, 'desc']] : null),
				'data'			: response.rows,
				'columns'		: response.cols,
				'colLabels'		: response.colLabels,
				'prependTo'		: tableWrapperEl,
				'export'		: false,//true,
				'exportBtns'	: exportBtns,
				'paging'		: false,
				'dataObj'		: _dataExport.data,
				'editModeToggle': _dataExport.data.editModeToggle,
				'expandRows'	: true
			});
		});
	}
	
	/*
	 * Builds list of export buttons with names
	 */
	this.getExportButtons = function() {
		var type = app.dataExport.data.type,
			buttons = [],
			exportName = _dataExport.generateFileName();
		
		if (type == 'events' || type == 'emailBlast') {
			buttons.push({
				'sExtends': 'csv', 
				'sFileName': exportName + '.csv'
			},
			{
				'sExtends': 'xls', 
				'sFileName':  exportName + '.xls'
			},
			{
				'sExtends': 'print'
			});
		} else {
			buttons.push({
				'sExtends': 'print'
			});
		}
		
		return buttons;
	}
	
	this.generateFileName = function() {
		var fromDate = _dataExport.els.fromDate.val(),
			toDate = _dataExport.els.toDate.val(),
			dataType = _dataExport.data.type,
			fileName;
			
		fileName = dataType + "-";
		fileName += fromDate.replace(/\//g,'.') + "-";
		fileName += toDate.replace(/\//g,'.');
		
		return fileName;
	}
	
	this.rowDelete = function(params) {
		var data = params['data'],
			table = data['table'],
			rowEl = params['row'],
			rowId = rowEl.find('.id').text();

		var response = false;
		if (confirm("Delete this note?") == true) {
			response = true;
		}
		
		if (!response || !rowId) { return true; }
		$.ajax({
			url: _dataExport.apis.eventDelete,
			data: {
				id: rowId
			}
		})
		.done(function(response) {
			response = $.parseJSON(response);
		
			if (response.status) {
				app.global.animate(rowEl, 'flash', null, function() {
					table.fnDeleteRow(rowEl);
				});
			}
		});
	}
}();