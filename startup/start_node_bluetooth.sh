#!/bin/bash

sudo hciconfig hci0 up
sudo forever -o /home/pi/vestel/startup/out.log -e /home/pi/vestel/startup/err.log /home/pi/vestel/main.js