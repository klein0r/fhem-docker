FROM debian:stretch

MAINTAINER Matthias Kleine <info@haus-automatisierung.com>

ENV FHEM_VERSION 5.9
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
initscripts \
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
libcpan-meta-yaml-perl \
libcrypt-cbc-perl \
libcrypt-ecb-perl \
libcrypt-rijndael-perl \
libcrypt-urandom-perl \
libdata-dump-perl \
libdatetime-format-strptime-perl \
libdatetime-perl \
libdbd-mysql \
libdbd-mysql libdbd-mysql-perl \
libdbd-mysql-perl \
libdbd-pg-perl \
libdbd-sqlite3-perl \
libdbi-perl \
libdevice-serialport-perl \
libdevice-usb-perl \
libdigest-crc-perl \
libdigest-md5-perl \
libdpkg-perl \
libencode-perl \
liberror-perl \
libev-perl \
libextutils-makemaker-cpanfile-perl \
libfile-copy-recursive-perl \
libfile-fcntllock-perl \
libfinance-quote-perl \
libgd-graph-perl \
libgd-text-perl \
libhtml-treebuilder-xpath-perl \
libimage-info-perl \
libimage-librsvg-perl \
libio-socket-inet6-perl \
libio-socket-ip-perl \
libio-socket-multicast-perl \
libio-socket-multicast6-perl \
libio-socket-ssl-perl \
libjson-perl \
libjson-xs-perl \
liblist-moreutils-perl \
libmail-imapclient-perl \
libmail-sendmail-perl \
libmath-round-perl \
libmime-base64-perl \
libmime-lite-perl \
libmojolicious-perl \
libmoose-perl \
libmp3-info-perl \
libmp3-tag-perl \
libnet-bonjour-perl \
libnet-telnet-perl \
libnmap-parser-perl \
libsoap-lite-perl \
libsocket-perl \
libsocket6-perl \
libswitch-perl \
libsys-hostname-long-perl \
libsys-statistics-linux-perl \
libterm-readkey-perl \
libterm-readline-perl-perl \
libtext-csv-perl \
libtext-diff-perl \
libtimedate-perl \
liburi-escape-xs-perl \
libwww-perl \
libxml-libxml-perl \
libxml-simple-perl \
libxml-treebuilder-perl

RUN cpan Crypt::Rijndael_PP
RUN cpan Net::MQTT::Simple
RUN cpan Net::MQTT::Constants

# Install fhem
RUN unlink /etc/localtime && ln -s /usr/share/zoneinfo/Europe/Berlin /etc/localtime && dpkg-reconfigure tzdata

RUN wget https://fhem.de/fhem-${FHEM_VERSION}.deb && dpkg -i fhem-${FHEM_VERSION}.deb
RUN userdel fhem

WORKDIR "/opt/fhem"

COPY core/start.sh ./

EXPOSE 8083 7072

CMD bash /opt/fhem/start.sh