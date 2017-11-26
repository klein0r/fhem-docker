FROM hypriot/rpi-java:latest

MAINTAINER Matthias Kleine <info@haus-automatisierung.com>

RUN apt-get update && apt-get upgrade -y --force-yes && apt-get install -y --force-yes --no-install-recommends apt-utils

RUN apt-get install -y --force-yes wget

RUN mkdir -p /opt/habridge && wget https://github.com/bwssytems/ha-bridge/releases/download/v4.1.4/ha-bridge-4.1.4.jar -O /opt/habridge/ha-bridge-4.1.4.jar

RUN echo Europe/Berlin > /etc/timezone && dpkg-reconfigure tzdata

WORKDIR "/opt/habridge"

CMD java -jar ha-bridge-4.1.4.jar
