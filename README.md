# FHEM Docker Base

This is a template for a docker based fhem installation. It contains a lot of services and is preconfigured / ready to start.

## Contains

- FHEM + haus-automatisierung.com FHEM frontend style + Tablet UI + ABFALL Module
- MQTT (configured)
- mySQL-Logging (configured)
- NodeRed
- HA-Bridge
- Grafana

## Requirements

- Docker
- Docker-Compose

## Install

```
git clone https://github.com/klein0r/fhem-docker.git fhem-docker
cd fhem-docker
docker-compose up -d
```

## Defaults / Ports

- FHEM: http://[ip]:8083/fhem
- Node-Red: http://[ip]:1880/

## Passwords

- fhem-User: admin
- fhem-Password: 1LOg2810AGBLmT2fn

- mySQL-User: fhemuser
- mySQL-Password: 2jRHnEi3WuNSQAcX7 (see mysql/init.sql and fhem/core/contrib/dblog/db.conf)

## Additional Information

- FHEM
    - HTTPS is not configured right now
    - No username and password protection! Create allowed-Device!
    - Ports 8084 and 8085 are closed