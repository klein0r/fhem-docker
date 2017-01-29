# FHEM Docker Base

## Contains

- FHEM + haus-automatisierung.com FHEM frontend style + Tablet UI + ABFALL Module
- Homebridge + FHEM Homebridge
- mySQL-Logging

## Requirements

- Docker
- Docker-Compose

## Install

```
git clone https://github.com/klein0r/fhem-docker.git fhem-docker
cd fhem-docker
cp ./fhem/data/fhem.cfg.example ./fhem/data/fhem.cfg
docker-compose up
```

## Defaults

- FHEM-WEB: 8083 (8084 and 8085 have been deleted)
- mySQL-User: fhemuser
- mySQL-Password: 2jRHnEi3WuNSQAcX7
- Homekit-Pairing-Code: 012-34-567

## Updating FHEM

Since all data in the container is static, you have to delete the container and recreate it to update fhem.
