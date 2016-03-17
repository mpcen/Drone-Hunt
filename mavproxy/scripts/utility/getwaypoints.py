#
# getwaypoints
# 
# Grab the currently stored waypoints fromt the Drone and store them to text
# from DroneAPI
# 

# Libraries
import os
from time import sleep
from pymavlink import mavutil

# Open text file for writing waypoints
reader = open('../public/pipes/current_waypoints.txt','w')

# First get an instance of the API endpoint and get 1st available vehicle
api = local_connect()
mrdj = api.get_vehicles()[0]

# Download waypoints from Drone
cmdlist = mrdj.commands
cmdlist.download()
cmdlist.wait_valid()
cmdct = cmdlist.count

print 'Is this printed in the console'
print cmdlist.__getitem__(0)

# Print the waypoints to file
if cmdct > 0:
	for i in range(0, cmdct):
		reader.write(str(cmdlist.__getitem__(i)) + '\n')

# Cleanup and Close
cmdlist.clear()
mrdj.flush()

reader.close()