$(document).ready(function(){
    // Refresh the table every second
    window.setInterval(function(){
        populateTable();
    }, 1000);
});



function populateTable(event){
    
    $.getJSON('/stats/update', function(data){

        if(data[0]._id === '1'){
            $('#p1_score').html(data[0].score);
            $('#p1_shots_fired').html(data[0].shots_fired);
            $('#p1_accuracy').html(data[0].accuracy+ '%');

            $('#p2_score').html(data[1].score);
            $('#p2_shots_fired').html(data[1].shots_fired);
            $('#p2_accuracy').html(data[1].accuracy+ '%');
        }
        else{
            $('#p1_score').html(data[1].score);
            $('#p1_shots_fired').html(data[1].shots_fired);
            $('#p1_accuracy').html(data[1].accuracy+ '%');

            $('#p2_score').html(data[0].score);
            $('#p2_shots_fired').html(data[0].shots_fired);
            $('#p2_accuracy').html(data[0].accuracy+ '%');
        }

    });
};

/*
mongoskin cmd for updating stuff:

*/