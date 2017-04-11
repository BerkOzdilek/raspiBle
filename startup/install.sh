#!/bin/bash

sudo npm install -g forever

sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev

cd ~/vestel
npm install bleno
npm install serialport

sudo service bluetooth stop
sudo update-rc.d bluetooth remove

sudo systemctl stop bluetooth
sudo systemctl disable bluetooth

sudo hciconfig hci0 up

sudo nano /etc/init.d/
sudo chmod 755 /etc/init.d/superscript
sudo update-rc.d superscript defaults