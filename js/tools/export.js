tools['dataExport'] = new function() {
	_dataExport = this;
	this.data = {
		type: null,
		table: null
	};

	this.els = {
		'fromDate': $('#date-picker-from'),
		'toDate': $('#date-picker-to'),
		'tableWrapper': $('#table-wrapper'),
		'userId': $('#userId'),
		'tableType': $('#table-type')
	};

	this.apis = {
		'events': '_eventData.php',
		'signatures': '_signatureData.php',
	}

	this.init = function() {
		_dataExport.getUserId();
		_dataExport.datePicker();
		_dataExport.tableTypeSelect();
		_dataExport.getTableData();
		$(window).overlay({show: false, delay: 250 });
	}
	
	this.tableTypeSelect = function() {
		_dataExport.els.tableType
			.buttonset()
			.show();
		_dataExport.data.type = _dataExport.tableTypeValue();

		// Add Events
		_dataExport.els.tableType.find('input[type=radio]').click(function() {
			var selected = $(this).attr('value')
			_dataExport.data.type = selected;
			_dataExport.getTableData();
			_dataExport.data.table.addClass(selected)
		});
	}
	
	this.tableTypeValue = function() {
		return _dataExport.els.tableType.find(':checked').attr('value');
	}
	
	this.getUserId = function() {
		_dataExport.data['userId'] = _dataExport.els.userId.val();
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
					_dataExport.els.toDate.datepicker('option', 'minDate', selectedDate);
					_dataExport.getTableData();
				}
			})
			.datepicker('setDate', lastMonth());

		_dataExport.els.toDate
			.datepicker({
				changeMonth: true,
				maxDate: 0,
				onClose: function(selectedDate) {
					if (!selectedDate) selectedDate = 0;
					_dataExport.els.fromDate.datepicker('option', 'maxDate', selectedDate);
					_dataExport.getTableData();
				}
			})
			.datepicker('setDate', today);
	}
	
	this.getTableData = function() {
		params = {
			user: _dataExport.data.userId,
			fromDate: _dataExport.els.fromDate.val(),
			toDate: _dataExport.els.toDate.val()
		}

		$.ajax({
			url: _dataExport.apis[_dataExport.data.type],
			data: params
		})
		.done(function(response) {
			response = $.parseJSON(response);
			console.log('response', response);
			
			_dataExport.els.tableWrapper.empty();
			tools.table.createTable({
				'sort'			: (response.sort ? [[response.sort, 'desc']] : null),
				'data'			: response.rows,
				'columns'		: response.cols,
				'colLabels'		: response.colLabels,
				'prependTo'		: _dataExport.els.tableWrapper,
				'export'		: true,
				'paging'		: true,
				'dataObj'		: _dataExport.data,
			});
		});
	}

}();