#!/bin/bash

set -e
cd /opt/fhem
port=7072

echo "Starte FHEM"
perl fhem.pl fhem.cfg

echo "FHEM Update"
perl fhem.pl 7072 "update all"

echo "FHEM Neustart"
perl fhem.pl 7072 "shutdown restart"

echo "Alles fertig"
tail -f /dev/null