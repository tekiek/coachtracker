tools['upload'] = new function() {
	_upload = this;
	this.apis = {
		'templateFile'	: '_template.php',
		'uploadFile'	: '_file.php',
		'importFile'	: '_import.php'
	}
	
	this.data = {
		uploadFile: null
	};

	_upload.els = {
		fileSelect		: $('#file_select'),
		fileImport		: $('#file_import'),
		downloadCsv		: $('#download_template'),
		file			: $('#file'),
		csvIframe		: $('#csv_iframe'),
		tableSelect		: $('#table_select'),
		filePreview		: $('#file-preview')
	}
	
	_upload.forms = {
		fileUploadForm: $('#file_upload_form')
	}

	this.init = function() {

		// Add Events
		_upload.els['downloadCsv'].click(_upload.downloadCsv);
		_upload.els['fileSelect'].click(_upload.fileSelect);
		_upload.els['fileImport'].click(_upload.fileImport).hide();
		_upload.els['file'].on("change", _upload.fileUpload);
		_upload.els['tableSelect'].on("change", _upload.changeTable);
	}
	
	this.fileImport = function() {
		$.ajax({
			url: _upload.apis.importFile,
			data: {
				table: _upload.els['tableSelect'].val(),
				file: _upload.data.uploadFile
			}
		})
		.done(function(response) {
			response = $.parseJSON(response);
			console.log('response', response);
			if (response.success == 'true') {
				alert('success');
				_upload.els['fileImport'].hide();
				_upload.els.filePreview.hide();
			}
		});
	}
	
	this.changeTable = function() {
		var table = $(this).val();
		
		if (table.length > 0) {
			window.location.href = window.location.href.split('?')[0] + "?table=" + table;
		}
	}
	
	this.fileUpload = function() {
		event.preventDefault();
		var file = event.target.files[0],
			data = new FormData();
		
		_upload.els.filePreview.addClass('hidden');
		if (file && file.name.match(/.csv/)) {
			data.append('myfile', file);
			data.append('extension', 'csv');
		} else {
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
			console.log('response', response);
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

				_upload.data.uploadFile = response.file;
				_upload.els['fileImport'].show();
				_upload.els.filePreview.show();

				_upload.filePreview({
					'data': data,
					'cols': cols
				});
				
			}
		});
		
	}

	/*
	 * Create table of uploaded file
	 * params:
	 * - data (array)
	 * - cols (array)
	 */
	this.filePreview = function(params) {
		_upload.els.filePreview
			.empty()
			.removeClass('hidden');
		
		tools.table.createTable({
			'data'		: params.data,
			'columns'	: params.cols,
			'prependTo'	: _upload.els.filePreview
		});
	}
	
	this.fileSelect = function() {
		event.preventDefault();
		_upload.els['file'].trigger('click');
	}
	
	this.downloadCsv = function() {
		event.preventDefault();
		var cols = $(this).data('cols'),
			csv =  _upload.apis.templateFile + "?cols=" + cols;
		
		_upload.els.csvIframe.attr('src', csv);
	}
	

}();