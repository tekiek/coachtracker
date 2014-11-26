tools['dataExport'] = new function() {
	_dataExport = this;
	this.data = {
		table: null
	};

	this.els = {
		'fromDate': $('#date-picker-from'),
		'toDate': $('#date-picker-to'),
		'tableWrapper': $('#table-wrapper'),
		'userId': $('#userId')
	};

	this.apis = {
		'eventData': '_eventData.php'
	}

	this.init = function() {
		_dataExport.getUserId();
		_dataExport.datePicker();
		_dataExport.getEventData();
		$(window).overlay({show: false, delay: 250 });
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
					_dataExport.getEventData();
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
					_dataExport.getEventData();
				}
			})
			.datepicker('setDate', today);
	}
	
	this.getEventData = function() {
		params = {
			user: _dataExport.data.userId,
			fromDate: _dataExport.els.fromDate.val(),
			toDate: _dataExport.els.toDate.val()
		}

		$.ajax({
			url: _dataExport.apis.eventData,
			data: params
		})
		.done(function(response) {
			response = $.parseJSON(response);
			console.log('response', response);
			
			_dataExport.els.tableWrapper.empty();
			tools.table.createTable({
				'data'			: response.rows,
				'columns'		: response.cols,
				'colLabels'		: response.colLabels,
				'prependTo'		: _dataExport.els.tableWrapper,
				'export'		: true,
				'dataObj'		: _dataExport.data,
			});
		});
	}

}();