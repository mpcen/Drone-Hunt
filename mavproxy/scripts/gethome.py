#
# gethome.py
# 
# Simply grab the raw data given by location command from DroneAPI
# 
#

# Libraries
import os

# Setup pipe for sending messages
pipe = open('../public/pipes/gethome.txt','w')

# First get an instance of the API endpoint and get 1st available vehicle
api = local_connect()
v = api.get_vehicles()[0]

# Pipe out location to calling script
raw_location = str(v.location)
lat = raw_location[raw_location.find('lat')+4:raw_location.find(',')]
raw_location = raw_location[raw_location.find('lon'):]
lon = raw_location[raw_location.find('lon')+4:raw_location.find(',')]


pipe.write(lat + ' ' + lon)
pipe.close()