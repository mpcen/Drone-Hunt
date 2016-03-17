// Loading Screen
$('#button').click(function(){
    var toLoad = '#main-content';
    $('#overlay').show();
    $('#loader').show();
    $('#page-content').hide();

    // Time out for 10 secs to give time for the bone to do its thang
    setTimeout(function(){
        window.location.replace('newgame')
        return false;
    },10000);
});
