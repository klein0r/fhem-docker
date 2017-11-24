FROM java:8-jdk

MAINTAINER Matthias Kleine <info@haus-automatisierung.com>

RUN mkdir -p /opt/habridge && wget https://github.com/bwssytems/ha-bridge/releases/download/v4.1.4/ha-bridge-4.1.4.jar -O /opt/habridge/ha-bridge-4.1.4.jar

RUN echo Europe/Berlin > /etc/timezone && dpkg-reconfigure tzdata

WORKDIR "/opt/habridge"

CMD java -jar ha-bridge-4.1.4.jar
