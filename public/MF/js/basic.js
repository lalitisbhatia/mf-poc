/*
 * SimpleModal Basic Modal Dialog
 * http://simplemodal.com
 *
 * Copyright (c) 2013 Eric Martin - http://ericmmartin.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

jQuery(function ($) {
	// Load dialog on page load
	//$('#basic-modal-content').modal();

	// Load dialog on click
	$('#basic').click(function (e) {
        console.log('basic href  clicked');
		$('#basic-modal-content').modal();
		return false;
	});

    $('#basic-modal-content-2').hide();

    // Load dialog on click
    $(':input').click(function (e) {
        console.log('basic-modal-content-2  clicked');
        $('#basic-modal-content-2').modal();
        return false;
    });

});