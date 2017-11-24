FROM debian:jessie

MAINTAINER Matthias Kleine <info@haus-automatisierung.com>

ENV FHEM_VERSION 5.8
ENV DEBIAN_FRONTEND noninteractive
ENV TERM xterm

# Install dependencies
RUN apt-get update && apt-get upgrade -y --force-yes && apt-get install -y --force-yes --no-install-recommends apt-utils
RUN apt-get -y --force-yes install \
apt-transport-https \
build-essential \
dfu-programmer \
etherwake \
git \
perl \
snmp \
snmpd \
sqlite3 \
sudo \
telnet \
usbutils \
vim \
wget

# Install perl packages
RUN apt-get -y --force-yes install \
libalgorithm-merge-perl \
libauthen-oath-perl \
libavahi-compat-libdnssd-dev \
libcgi-pm-perl \
libclass-dbi-mysql-perl \
libclass-isa-perl \
libcommon-sense-perl \
libconvert-base32-perl \
libcrypt-urandom-perl \
libdata-dump-perl \
libdatetime-format-strptime-perl \
libdbd-sqlite3-perl \
libdbi-perl \
libdevice-serialport-perl \
libdpkg-perl \
liberror-perl \
libfile-copy-recursive-perl \
libfile-fcntllock-perl \
libgd-graph-perl \
libgd-text-perl \
libimage-info-perl \
libimage-librsvg-perl \
libio-socket-inet6-perl \
libio-socket-ip-perl \
libio-socket-multicast-perl \
libio-socket-ssl-perl \
libjson-perl \
libjson-xs-perl \
liblist-moreutils-perl \
libmail-imapclient-perl \
libmail-sendmail-perl \
libmime-base64-perl \
libnet-telnet-perl \
libsoap-lite-perl \
libsocket-perl \
libsocket6-perl \
libswitch-perl \
libsys-hostname-long-perl \
libterm-readkey-perl \
libterm-readline-perl-perl \
libtext-csv-perl \
libtext-diff-perl \
libtimedate-perl \
libwww-perl \
libxml-simple-perl

# Install fhem
RUN echo Europe/Berlin > /etc/timezone && dpkg-reconfigure tzdata

RUN wget https://fhem.de/fhem-${FHEM_VERSION}.deb && dpkg -i fhem-${FHEM_VERSION}.deb
RUN userdel fhem

WORKDIR "/opt/fhem"

COPY core/start.sh ./

EXPOSE 8083 7072

CMD bash /opt/fhem/start.sh