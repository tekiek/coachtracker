tools['upload'] = new function() {
	_upload = this;
	this.apis = {
		'templateFile'	: '_template.php',
		'uploadFile'	: '_file.php',
		'importFile'	: '_import.php'
	}
	
	this.data = {
		uploadFile: null,
		dataTable: {}
	};

	_upload.els = {
		fileSelect		: $('#file_select'),
		fileImport		: $('#file_import'),
		getTemplateBtn	: $('#download_template'),
		file			: $('#file'),
		csvIframe		: $('#csv_iframe'),
		tableSelect		: $('#table_select'),
		filePreview		: $('#file-preview'),
		dataInsertBtn	: $('#database-insert-wrapper')
	}
	
	_upload.forms = {
		fileUploadForm: $('#file_upload_form')
	}

	this.init = function() {
		// download template
		_upload.els['getTemplateBtn'].click(_upload.getTemplate);

		// upload selected file
		_upload.els['fileSelect'].click(_upload.fileSelect);
		_upload.els['fileImport'].click(_upload.fileImport);
		_upload.els['file'].on("change", _upload.uploadSelectedFile);
		_upload.els['tableSelect'].on("change", _upload.tableSelected);
	}
	
	/* ----------- DOWNLOAD TEMPLATE ----------- */
	
	/*
	 * Get selected table
	 */
	this.getSelectedTable = function() {
		return _upload.els.tableSelect.val();
	}
	
	this.tableSelected = function() {
		//window.history.pushState({}, "CT", "table=" + getSelectedTable.);
	}

	/*
	 * Download table template 
	 */
	this.getTemplate = function() {
		event.preventDefault();
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
	
	this.uploadSelectedFile = function() {
		event.preventDefault();
		var file = event.target.files[0],
			data = new FormData();

		// Hide preview table
		_upload.filePreview({ 'show': false });

		// Check file extension
		if (file && file.name.match(/.csv/)) {
			data.append('myfile', file);
			data.append('extension', 'csv');
			data.append('table', _upload.getSelectedTable());
		} else {
			$(window).overlay({
				show: true, 
				delay: 1000,
				msg: "Invalid File!"
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
				$(window).overlay({
					show: true, 
					delay: 1000,
					msg: response.error
				});
			}
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
		if (!params) return false;
		if (!params['show']) params['show'] = false;

		if (params['show']) {
			_upload.els.filePreview.empty().show();
			_upload.els.dataInsertBtn.show();

			tools.table.createTable({
				'data'		: params.data,
				'columns'	: params.cols,
				'dataObj'	: _upload.data.dataTable,
				'paging'	: false,
				'prependTo'	: _upload.els.filePreview
			});
		} else {
			_upload.els.filePreview.hide();
			_upload.els.dataInsertBtn.hide();
		}
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
			$(window).overlay({
				show: true, 
				delay: 1000,
				msg: response.msg
			});
			_upload.filePreview({ 'show': false });
		});
	}

	

}();