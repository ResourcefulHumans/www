$( document ).ready(function() {
    $(document).on( 'scroll', function(){
        if(!$('.navbar-header').hasClass('collapsed')) {
            $('#navbar').collapse('hide');
        }
    });
});