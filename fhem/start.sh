#!/bin/bash

echo "Starte FHEM"
sudo service fhem start

echo "FHEM Update"
perl fhem.pl 7072 "update all"

echo "FHEM Neustart"
perl fhem.pl 7072 "shutdown restart"

echo "Alles fertig"
tail -f /dev/null