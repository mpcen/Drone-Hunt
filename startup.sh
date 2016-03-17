#!/bin/bash
#
#   Setup Script for setting up web and MAVProxy
#
#   Ensure that the following are connected to the system before starting up.
#

# Settings
webdir="/var/www/dronehunt"
msp430="/dev/serial/by-id/usb-Texas_Instruments_Texas_Instruments_MSP-FET430UIF_5DFF4A7AB7454B25-if00"

radio_module="/dev/serial/by-id/usb-FTDI_FT232R_USB_UART_A103IHO7-if00-port0"
atmega="/dev/serial/by-id/usb-Arduino__www.arduino.cc__Arduino_Mega_2560_640363636383513150F0-if00"
baud_rate=57600

mp_ip="10.32.1.200:46650"

# Probe for Devices
if [[ ! -e $msp430 ]]
then
     echo MSP430 is not plugged in. Please recheck connection.
     exit 5
fi

# Cable/Wireless Drone Connection
if [[ $1 == "wired" ]]
then
    if [[ -e $atmega ]]
    then
        radio_module=$atmega
        baud_rate=115200
    else
        echo APM is not plugged in via cable. Please recheck connection
        exit 5
    fi
else
    if [[ ! -e $radio_module ]]
    then
         echo Radio module is not plugged in. Please recheck connection.
         exit 5
    fi
fi

# Mongo DB
cd $webdir
mkdir -p $webdir/data
screen -dmS mongo
screen -S mongo -X stuff "mongod --dbpath ./data $(printf '\015')"

# MAVProxy
cd $webdir/mavproxy
screen -dmS mavproxy
screen -S mavproxy -X stuff "mavproxy.py --baudrate $baud_rate --master $radio_module --out=$mp_ip $(printf '\015')"

# Web
cd $webdir
screen -dmS web
screen -S web -X stuff "npm start $(printf '\015')"
