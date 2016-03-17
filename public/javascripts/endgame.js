$(document).ready(function(){
    populateTable();
});

$('#button_newgame').click(function(){
  window.location.replace('newgame');
});

$('#button_endgame').click(function(){
  window.location.replace('credits');
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

            //first index is player 1
            if(data[0].score > data[1].score){
                // Player 1 wins
                document.getElementById('winner_p1').style.display ='block';
            }
            else if(data[0].score < data[1].score){
                // Player 2 wins
                document.getElementById('winner_p2').style.display ='block';
            }
            else if(data[1].score === data[0].score){
                document.getElementById('winner_draw').style.display ='block';
            }
        }
        else{

            $('#p1_score').html(data[1].score);
            $('#p1_shots_fired').html(data[1].shots_fired);
            $('#p1_accuracy').html(data[1].accuracy+ '%');

            $('#p2_score').html(data[0].score);
            $('#p2_shots_fired').html(data[0].shots_fired);
            $('#p2_accuracy').html(data[0].accuracy+ '%');

            //first index is player 2
            if(data[0].score > data[1].score){
                // Player 2 wins
                document.getElementById('winner_p2').style.display ='block';
            }
            else if(data[0].score < data[1].score){
                // Player 1 wins
                document.getElementById('winner_p1').style.display ='block';
            }
            else if(data[1].score === data[0].score){
                document.getElementById('winner_draw').style.display ='block';
            }
        }

        // if(data[0].score > data[1].score){
        //     document.getElementById('winner_p1').style.display ='block';
        // }
        // else if(data[0].score < data[1].score){
        //     document.getElementById('winner_p2').style.display ='block';
        // }
        // else if(data[0].score === data[1].score){
        //     document.getElementById('winner_draw').style.display ='block';
        // }

        $('#p1_score').html(data[0].score);
        $('#p1_shots_fired').html(data[0].shots_fired);
        $('#p1_accuracy').html(data[0].accuracy+ '%');

        $('#p2_score').html(data[1].score);
        $('#p2_shots_fired').html(data[1].shots_fired);
        $('#p2_accuracy').html(data[1].accuracy+ '%');
    });
};