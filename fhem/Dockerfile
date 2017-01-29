FROM debian:jessie

MAINTAINER Matthias Kleine <info@haus-automatisierung.com>

ENV DEBIAN_FRONTEND noninteractive
ENV TERM xterm

# Install dependencies
RUN apt-get update && apt-get upgrade -y --force-yes && apt-get install -y --force-yes --no-install-recommends apt-utils
RUN apt-get -y --force-yes install perl wget git apt-transport-https sudo etherwake dfu-programmer build-essential snmpd snmp vim telnet usbutils

# Install perl packages
RUN apt-get -y --force-yes install \
libavahi-compat-libdnssd-dev \
libalgorithm-merge-perl \
libclass-dbi-mysql-perl \
libclass-isa-perl \
libcommon-sense-perl \
libdatetime-format-strptime-perl \
libdbi-perl \
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


RUN echo Europe/Berlin > /etc/timezone && dpkg-reconfigure tzdata

RUN wget https://debian.fhem.de/fhem.deb && dpkg -i fhem.deb
RUN cd /opt/fhem/www/ && git clone https://github.com/klein0r/fhem-style-haus-automatisierung.git hausautomatisierung-com && chown -R fhem:dialout /opt/fhem/www/hausautomatisierung-com
RUN userdel fhem

WORKDIR "/opt/fhem"


COPY start.sh ./

EXPOSE 8083 7072

CMD bash /opt/fhem/start.sh