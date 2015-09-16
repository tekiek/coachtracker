app['upload'] = new function() {
	_upload = this;
	this.els = {};
	this.forms = {};
	this.apis = {
		'templateFile'	: '_template.php',
		'uploadFile'	: '_uploadFile.php',
		'importFile'	: '_import.php'
	}
	
	this.data = { 
		uploadFile: null,
		dataTable: {},
		tableCols: {},
		table: null
	};

	this.init = function() {
		_upload.getEls();
		_upload.getTableCols();
		
		// download template
		_upload.els['getTemplateBtn'].click(_upload.getTemplate);

		// upload selected file
		_upload.els['fileSelect'].click(_upload.fileSelect);
		_upload.els['fileImport'].click(_upload.fileImport);
		_upload.els['file'].on("change", _upload.uploadSelectedFile);

		// Setup Tabs
		app.libs.waitForLib({
			lib: 'jqueryui',
			cb: function() {
				_upload.setupTabs();
				_upload.els.content.show();
			}
		});
	}
	
	this.setupTabs = function() {
		_upload.els.tableTabs.tabs({
			activate: function(event, ui) {
				_upload.openTableTab({
					tab: $(ui.newTab),
					panel: $(ui.newPanel)
				});
			},
			create: function(event, ui) {
				_upload.openTableTab({
					tab: $(ui.tab),
					panel: $(ui.panel)
				});
			}
		});
	}
	
	this.openTableTab = function(params) {
		var table = params.tab.data('table')
		
		_upload.data.table = table;
		_upload.filePreview();
		_upload.clearFile();
	}
	
	this.getEls = function() {
		_upload.els = {
			content				: $('#content'),
			fileSelect			: $('#file_select'),
			fileImport			: $('#file_import'),
			getTemplateBtn		: $('#download_template'),
			file				: $('#file'),
			csvIframe			: $('#csv_iframe'),
			filePreview			: {
				users		: $('#file-preview-users'),
				students	: $('#file-preview-students')
			},
			tableTabs			: $('#tableTabs')
		}

		_upload.forms = {
			fileUploadForm: $('#file_upload_form')
		}
	}
	
	this.getTableCols = function() {
		if (window.tableCols) {
			_upload.data.tableCols = window.tableCols;
		}
	}
	
	/* ----------- DOWNLOAD TEMPLATE ----------- */
	
	/*
	 * Get selected table
	 */
	this.getSelectedTable = function() {
		return _upload.data.table;
	}

	/*
	 * Download table template 
	 */
	this.getTemplate = function() {
		//event.preventDefault();

		var templateSrc =  _upload.apis.templateFile + "?table=" + _upload.getSelectedTable();
		_upload.els.csvIframe.attr('src', templateSrc);
	}
	
	/* ----------- UPLOAD FILE ----------- */
	
	/*
	 * Callback for when user selects file
	 */
	this.fileSelect = function() {
		event.preventDefault();
		_upload.els['file'].trigger('click');
	}
	
	/*
	 * Clear the file input value to trigger new upload
	 */
	this.clearFile = function() {
		_upload.els['file'].val('');
	}
	
	this.uploadSelectedFile = function() {
		event.preventDefault();
		var file = event.target.files[0],
			data = new FormData();

		// Hide preview table
		_upload.filePreview();

		// Check file extension
		if (file && file.name.match(/.csv/)) {
			data.append('myfile', file);
			data.append('extension', 'csv');
			data.append('table', _upload.getSelectedTable());
		} else {
			$(document).overlay({
				show: true,
				msg: "Invalid File!",
				delay: 2000
			});
			return false;
		}

		$.ajax({
			type: "POST",
			url: _upload.apis.uploadFile,
			data: data,
			dataType: 'json',
			processData: false,
			contentType: false
		})
		.done(function(response) {
			// $('body').replaceWith(response.test);
			// return false;
			
			if (response.success == 'true') {
				var cols = response.columns,
					data = [];

				// Clean Data
				$.each(response.data, function(x, d) {
					var row = {};
					$.each(cols, function(y, c) {
						row[c] = d[y];
					});
					data.push(row);
				});

				// Show preview data
				_upload.data.uploadFile = response.file;
				_upload.filePreview({
					'show': true,
					'data': data,
					'cols': cols
				});
			} else {
				var errorMsg = response.error ? response.error : "Server Error!";

				setTimeout(function() {
					$(document).overlay({
						show: true,
						msg: errorMsg,
						delay: 2000
					});
				}, 1);
			}
			_upload.clearFile();
		});	
	}

	/* ----------- PREVIEW FILE IN TABLE ----------- */

	/*
	 * Create table of uploaded file or hide it
	 * params:
	 * - show (boolean)
	 * - data (array)
	 * - cols (array)
	 */
	this.filePreview = function(params) {
		if (!params) params = {};
		if (!params['show']) params['show'] = false;
		if (!params['data']) params['data'] = [];
		
		var table = _upload.data.table,
			tableEl = _upload.els.filePreview[table],
			tableCols = _upload.data.tableCols[table];

		if (params.data.length > 0) {
			_upload.els.fileImport.show();
		} else {
			_upload.els.fileImport.hide();
		}

		console.log('params', params);
		
		var tableParms = {
			'data'		: params.data,
			'columns'	: params.cols, //tableCols,
			'dataObj'	: _upload.data.dataTable,
			'paging'	: false,
			'prependTo'	: tableEl
		}
		tableEl.empty().show();
		
		console.log('-------', tableParms);
		app.table.createTable(tableParms);
	}


	/* ----------- IMPORT FILE INTO DATABASE ----------- */

	/*
	 * Import file into database
	 */
	this.fileImport = function() {
		$.ajax({
			url: _upload.apis.importFile,
			data: {
				table: _upload.getSelectedTable(),
				file: _upload.data.uploadFile
			}
		})
		.done(function(response) {
			response = $.parseJSON(response);
			var errorMsg = response.msg ? response.msg : "Server Error!";

			setTimeout(function() {
				$(document).overlay({
					show: true,
					msg: errorMsg,
					delay: 2000
				});
			}, 1);
			
			if (response.success == 'true') {
				_upload.filePreview();
			} else {
				var table = _upload.data.table,
					tableEl = _upload.els.filePreview[table],
					tableRows = tableEl.find('tbody tr');
				
				$.each(tableRows, function(x, row) {
					if ($.inArray(x, response.failedRows) > -1) {
						$(row).addClass('error');
					}
				})
			}
		});
	}
	

}();