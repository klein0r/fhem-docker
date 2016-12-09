#!/bin/bash

/etc/init.d/dbus restart
service avahi-daemon start
homebridge