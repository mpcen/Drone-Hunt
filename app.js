var express = require('express');
var serialport = require('serialport');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;
var mongo = require('mongoskin');

// Set up DB
var db = mongo.db("mongodb://localhost:27017/GameEngine", {native_parser:true});

// Set up Serial -- FALL BACK IF PYTHON DOESN'T WORK!
var latestData = 0;
var scoreValue = 5;

var msp430 = "/dev/serial/by-id/usb-Texas_Instruments_Texas_Instruments_MSP-FET430UIF_5DFF4A7AB7454B25-if00";

var serial = serialport.SerialPort; //Library

var port = new serial(msp430, //Port Setup
     {
          baudRate: 9600,
          parser: serialport.parsers.readline("\r\n")
     }
);

port.on('data', saveLatestData); // Turn the serial port on

function saveLatestData(data) // Get the latest data from port
{
    //Get Data from Callback
    console.log("New data! It's this: " + data);
    latestData = data;
    
    //Prepare Dataset
    db.collection('scores').find().toArray(function(err, result) 
    {
        //Update DB according to case
        //Drone -- Player 1 Hit
        if(latestData == "2A")
        {
            db.collection('scores').update({'_id':'1'}, {$inc:{"score": scoreValue }}, function() {});
            
            if(result[0].shots_fired == 0)
                db.collection('scores').update({'_id':'1'}, {$set:{"accuracy" : 100 }},function() {});                
            
            else
                db.collection('scores').update({'_id':'1'}, {$set:{"accuracy" : (result[0].score / scoreValue) / result[0].shots_fired * 100 }},function() {});
        }
        
        //Drone -- Player 2 Hit
        else if(latestData == "2B")
        {
            db.collection('scores').update({'_id':'2'}, {$inc:{"score": scoreValue }}, function() {});
            
            if(result[1].shots_fired == 0)
                db.collection('scores').update({'_id':'2'}, {$set:{"accuracy" : 100 }},function() {});                
            
            else
                db.collection('scores').update({'_id':'2'}, {$inc:{"accuracy" : (result[1].score / scoreValue) / result[1].shots_fired * 100 }},function() {});
        }
        
        //Gun 1 -- Player 1 Hit
        else if(latestData == "3A")
        {
            db.collection('scores').update({'_id':'1'}, {$inc:{"shots_fired": 1 }}, function() {});
            db.collection('scores').update({'_id':'1'}, {$set:{"accuracy" : (result[0].score / scoreValue) / result[0].shots_fired * 100 }}, function() {});             
        }
        
        //Gun 2 -- Player 2 Hit
        else if(latestData == "4B")
        {
            db.collection('scores').update({'_id':'2'}, {$inc:{'shots_fired': 1 }}, function(){});
            db.collection('scores').update({'_id':'2'}, {$set:{"accuracy" : (result[1].score / scoreValue) / result[1].shots_fired * 100 }}, function() {});            
        }
    });
}

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());3
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our DB accessable by our router
app.use(function(req, res, next){
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
