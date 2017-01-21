#!/bin/bash

sudo service fhem start
perl fhem.pl 7072 "update all"
perl fhem.pl 7072 "shutdown restart"

tail -f /dev/null