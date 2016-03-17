var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;

/* GET Main Menu page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Drone Hunt' });

  // Get Mr.DJ's coordinates from APM and store them in public/pipes/gethome.txt on page load
  exec('screen -S mavproxy -X stuff "api start scripts/gethome.py $(printf \'\015\')"', function(error, stdout, stderr)
  {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if(error !== null)
      {
        console.log('exec error: ' + err);
      }
    });
    
});

/* GET New Game page. */
router.get('/newgame', function(req, res, next) {
  res.render('newgame', { title: 'New Game' });
});

/* POST New Game page. */
router.post('/newgame',function(req, res){
  // Load coords into Mr. DJ
  exec('screen -S mavproxy -X stuff "api start scripts/writemission.py $(printf \'\015\')"', function(error, stdout, stderr)
  {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if(error !== null)
      {
        console.log('exec error: ' + err);
      }
    });
  
  // Get the posted game time
  var game_time = req.body.game_time;
  console.log("POSTED GAME TIME "+game_time);
  var db = req.db;

  req.db.collection('gameSettings').insert(req.body,function(err, result){
    if(err){
      res.send("There was a problem adding the information to the database");
    }
    else{
      res.json({message:'success'});
    }
  });

  // Create record for Player 1
  req.db.collection('scores').insert({'_id': '1', 'score': 0, 'shots_fired': 0, 'accuracy': 0.0, 'game_time': game_time}, function(err, result){
    console.log("inside create player 1");
    if(err){
      console.log("Player 1 record already exists.");
      db.collection('scores').update({'_id':'1'}, {$set:{'game_time':game_time, 'score': 0, 'shots_fired': 0, 'accuracy': 0.0}}, function(err, result){
        if(err){
          console.log("Something went wrong");
        }
        // Update the game time
        else{
          console.log("Game Time updated");
        }
      });
    }
    else console.log("Created Player 1 record");
  });

  // Create record for Player 2
  req.db.collection('scores').insert({'_id': '2', 'score': 0, 'shots_fired': 0, 'accuracy': 0.0, 'game_time': game_time}, function(err, result){
    console.log("inside create player 2");
    if(err){
      console.log("Player 2 record already exists.");
      db.collection('scores').update({'_id':'2'}, {$set:{'game_time':game_time, 'score': 0, 'shots_fired': 0, 'accuracy': 0.0}}, function(err, result){
        if(err){
          console.log("Something went wrong");
        }
        // Update the game time
        else{
          console.log("Game Time updated");
        }
      });
    }
    else console.log("Created Player 2 record");
  });
  
});

/* GET Statistics page. */
router.get('/stats', function(req, res, next) {
  res.render('stats', { title: 'Statistics' });
});

/* GET UPDATES page. */

router.get('/stats/update', function(req, res) {
  var db = req.db;
  db.collection('scores').find().toArray(function(err, items){
    res.json(items);
  });
});

/* GET End Game page. */
router.get('/endgame', function(req, res, next) {
  res.render('endgame', { title: 'End Game' });
});

/* GET Credits page. */
router.get('/credits', function(req, res, next) {
  res.render('credits', { title: 'Credits' });
});


module.exports = router;