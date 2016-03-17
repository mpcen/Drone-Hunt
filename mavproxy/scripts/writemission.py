#
# writewaypoints
# 
# Write new waypoints to the APM for mission planning
#
#

# Libraries
import os
import pymongo
import subprocess
from bson import BSON
from pymongo import MongoClient
from pymavlink import mavutil

# Static defines
alt = 9; # GPS Format for 30 FT
wpfile = "data/mission.txt"

# Establish connection with local Mongo server
client = MongoClient()

# Open database for reading waypoints
db = client['GameEngine']
gameSettings = db['gameSettings']

# Open file for writing waypoints and write header
mission_file = open(wpfile, 'w')
mission_file.write("QGC WPL 110\n")

# Get Lastest Game
c = gameSettings.count()
query = gameSettings.find({}, {'region': True , '_id': False}, skip=c-1)
entry = query[0].get('region')

# # First get an instance of the API endpoint and get 1st available vehicle
api = local_connect()
mrdj = api.get_vehicles()[0]
chain = mrdj.commands
print mrdj.waypoint_home

# # Clear previous mission
chain.clear()
mrdj.flush()

# Write Home & Takeoff
lat = entry[0].get('lat', 0)
lon = entry[0].get('lon', 0)
mission_file.write("0\t1\t0\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + str(lat) + "\t" + str(lon) + "\t0.000000\t1\n")
mission_file.write("0\t0\t3\t22\t0.000000\t0.000000\t0.000000\t0.000000\t" + str(lat) + "\t" + str(lon) + "\t" + str(alt) + "\t1\n")

# Force Home


# Write Points
for coord_pair in entry[1:]:
    lat = coord_pair.get('lat', 0)
    lon =  coord_pair.get('lon', 0)
    mission_file.write("0\t0\t0\t16\t0.000000\t0.000000\t0.000000\t0.000000\t" + str(lat) + "\t" + str(lon) + "\t" + str(alt) + ".000000\t1\n")

# Write Looping Command
mission_file.write("0\t0\t3\t177\t2.000000\t-1.000000\t0.000000\t0.000000\t0.000000\t0.000000\t0.000000\t1\n")

# Load mission to APM (dirty)
subprocess.call("screen -S mavproxy -X stuff \"wp load data/mission.txt $(printf '\015')\"", shell=True)

# Cleanup and Close
mission_file.close()