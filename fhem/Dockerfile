FROM debian:jessie

MAINTAINER Matthias Kleine <info@haus-automatisierung.com>

ENV DEBIAN_FRONTEND noninteractive
ENV TERM xterm

# Install dependencies
RUN apt-get update && apt-get upgrade -y --force-yes && apt-get install -y --force-yes --no-install-recommends apt-utils
RUN apt-get -y --force-yes install perl wget git apt-transport-https libavahi-compat-libdnssd-dev sudo nodejs etherwake

# Install perl packages
RUN apt-get -y --force-yes install libalgorithm-merge-perl \
libclass-isa-perl \
libcommon-sense-perl \
libdevice-serialport-perl \
libdpkg-perl \
liberror-perl \
libfile-copy-recursive-perl \
libfile-fcntllock-perl \
libio-socket-ip-perl \
libio-socket-ssl-perl \
libjson-perl \
libjson-xs-perl \
libmail-sendmail-perl \
libsocket-perl \
libswitch-perl \
libsys-hostname-long-perl \
libterm-readkey-perl \
libterm-readline-perl-perl \
libwww-perl \
libxml-simple-perl

# Install fhem
RUN wget -qO - https://debian.fhem.de/archive.key | apt-key add -
RUN echo "deb https://debian.fhem.de/stable ./" | tee -a /etc/apt/sources.list.d/fhem.list
RUN apt-get update
RUN apt-get -y --force-yes install fhem telnet

RUN echo Europe/Berlin > /etc/timezone && dpkg-reconfigure tzdata

RUN chown fhem /opt/fhem/fhem.cfg

VOLUME ["/opt/fhem"]

EXPOSE 8083
