# DroneHunt

Drone Hunt derived from Duck Hunt, laser tag, and skeet. The idea behind it all is to have a sensor-equipped, medium-sized, lightweight, and agile quadcopter flying autonomously while players target and shoot the drone with modified IR guns for a high score under adjustable time and boundary constraints. The onboard sensors will send real-time scores and statistics to the server hosted by a BeagleBone Black running the game engine and UI on a M.E.A.N stack inside a custom-built ground control station.
<hr/>

Steps to build this:

<h3>1. Make 'data' folder in root and set dbpath inside data/:</h3>

> cd path/to/Dronehunt/ <br>
> mkdir data <br>
> cd data <br>
> mongod --dbpath .

<h3>2. Start server from root:</h3>

> npm start

<h3>3. If you get the bson c++ error, remove node_modules folder, clear npm cache, reinstall packages, then restart server:</h3>

> rm -rf /DroneHunt/node_modules <br>
> npm cache clear <br>
> npm install <br>
> npm start <br>

<h3>4. Should work now. The following are important commands needed to update the stats page:</h3>

The Player schema looks like the following

Database name: GameEngine <br>
Collection name: scores <br>
Make sure to 'use GameEngine'

To search it from mongo shell:
> db.scores.find().pretty()

Player 1: {'_id': '1', 'score': '0', 'shots_fired': '0', 'accuracy': '0.0'}

Player 2: {'_id': '2', 'score': '0', 'shots_fired': '0', 'accuracy': '0.0'}


So for example, to update Player 1's score to 5 you would do it like this from the shell:

> db.collection('scores').update({'_id':'1'}, {$set:{'score':5}})

<h3>This should be all you need to finish up. Holla if you get stuck. Remember, we're using MongoSkin for MongoDB. An awesome guide on syntax and stuff is here: http://www.hacksparrow.com/mongoskin-tutorial-with-examples.html</h3>

<h1>Manny ERRRR FRESHHHHHH</h1>
