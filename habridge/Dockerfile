FROM java:8-jdk

MAINTAINER Matthias Kleine <info@haus-automatisierung.com>

ENV BRIDGE_VERSION 5.2.1

RUN mkdir -p /opt/habridge && wget https://github.com/bwssytems/ha-bridge/releases/download/v${BRIDGE_VERSION}/ha-bridge-${BRIDGE_VERSION}.jar -O /opt/habridge/ha-bridge-${BRIDGE_VERSION}.jar

RUN unlink /etc/localtime && ln -s /usr/share/zoneinfo/Europe/Berlin /etc/localtime && dpkg-reconfigure tzdata

WORKDIR "/opt/habridge"

CMD java -jar ha-bridge-${BRIDGE_VERSION}.jar
