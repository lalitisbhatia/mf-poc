$( ".accordion" ).accordion();

// Hover states on the static widgets
$( "#dialog-link, #icons li" ).hover(
    function() {
        $( this ).addClass( "ui-state-hover" );
    },
    function() {
        $( this ).removeClass( "ui-state-hover" );
    }
);

// Hover states on the static widgets
$( ".accordion #dialog-link, .accordion #icons li" ).hover(
    function() {
        $( this ).addClass( "accordion ui-state-hover" );
    },
    function() {
        $( this ).removeClass( "accordion ui-state-hover" );
    }
);

$(function() {
    $( ".accordion" ).accordion({
        collapsible: true, active: false, heightStyle: "fill"
    });
});
