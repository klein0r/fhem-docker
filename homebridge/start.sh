#!/bin/bash

sleep 15s
echo "Starte Homebridge nach Wartezeit für FHEM-Update..."

/etc/init.d/dbus restart
service avahi-daemon start
homebridge