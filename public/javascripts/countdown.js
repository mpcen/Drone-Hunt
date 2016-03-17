$.getJSON('/stats/update', function(data){
    var game_time = new Date();


    var currentDate = new Date();
    //console.log("Current time: "+currentDate);

    game_time.setTime(currentDate.getTime()+data[0].game_time * 1000);

var cset, countdown = {

    settings: {
        dateStart  : new Date(),
        dateEnd    : new Date(game_time),
        elements   : document.querySelectorAll(".timer"),
        msgBefore  : "Be ready!",
        msgAfter   : "<h1>GAME OVER!</h1>",
        msgPattern : '<h1><span>{minutes} : {seconds}</span></h1>',
        msgPattern2 : '<h1><span>{minutes} : 0{seconds}</span></h1>',
        patterns   : [{
          pattern: '{years}',
          secs: 31536000,
        }, {
          pattern: '{months}',
          secs: 2628000,
        }, {
          pattern: '{weeks}',
          secs: 604800,
        }, {
          pattern: '{days}',
          secs: 86400
        }, {
          pattern: '{hours}',
          secs: 3600
        }, {
          pattern: '{minutes}',
          secs: 60
        }, {
          pattern: '{seconds}',
          secs: 1
        }],
        interval   : 1000,
        now        : new Date()  
    }, 
    
    init: function() {
        cset = this.settings;
        this.defineInterval();
        //console.log('date start = '+cset.dateStart);
        //console.log('date end = '+cset.dateEnd);
        //console.log('cset now = '+cset.now);
      
        cset.now < cset.dateEnd ? this.run() : this.outOfInterval();
    },

    run: function() {
        var nowTS    = cset.now.valueOf() / 1000,
            tarTS    = cset.dateEnd.valueOf() / 1000,
            sec      = Math.abs(tarTS - nowTS);

        var timer = setInterval(function() {
                sec--;
                
                if(sec > 0) 
                {
                    countdown.display(sec);
                } 
                
                else
                {
                    countdown.outOfInterval();
                    clearInterval(timer);
                }
            }, cset.interval);
      
        countdown.display(sec);
    },
  
    defineInterval: function() {
      for (var i = cset.patterns.length; i > 0; i--) { 
        var currentPattern = cset.patterns[i-1];
        
        if (cset.msgPattern.indexOf(currentPattern.pattern) !== -1) {
          cset.interval = currentPattern.secs * 1000;
          return;
        }
      }
    },
  
    display: function(sec) {
      var output = cset.msgPattern;
    
      for (var i = 0, len = cset.patterns.length; i < len; i++) {
        var currentPattern = cset.patterns[i];
        
        if (cset.msgPattern.indexOf(currentPattern.pattern) !== -1) {
          var number = Math.floor(sec / currentPattern.secs);          
          sec -= number * currentPattern.secs;

          // Fixes the single digit thing...
          if(sec === 0 && number < 10){
            output = output.replace(currentPattern.pattern, '0'+number);
          }
          else{
            output = output.replace(currentPattern.pattern, number);  
          }
        }  
      }
          
      for(var i = 0, len = cset.elements.length; i < len; i++)
        cset.elements[i].innerHTML = output;
    },

    outOfInterval: function() {
      var message = cset.now > cset.dateStart ? cset.msgAfter : cset.msgAfter;
      for(var i = 0, len = cset.elements.length; i < len; i++)
        //cset.elements[i].innerHTML = message;
        window.location.replace('endgame');
      /*      
      // Display the hidden buttons after game ends
      document.getElementById('button_newgame').style.display ='inline';
      document.getElementById('button_endgame').style.display ='inline';
      // Hide the 'Time Remaining' header once game ends
      document.getElementById('time_remaining').style.display ='none';*/
    }

}

countdown.init();

});