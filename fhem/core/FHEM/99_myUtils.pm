##############################################
# $Id: myUtilsTemplate.pm 7570 2015-01-14 18:31:44Z rudolfkoenig $
#
# Save this file as 99_myUtils.pm, and create your own functions in the new
# file. They are then available in every Perl expression.

package main;

use strict;
use warnings;
use POSIX;
use DateTime::Format::Strptime;

sub
myUtils_Initialize($$)
{
  my ($hash) = @_;
}

# Enter you functions below _this_ line.

sub RSSFeedTimeToDDMMYY($) {
    # Sat, 18 Mar 2017 00:00:00 +0100
    # Mon, 14 Aug 2017 05:00:33 +0000

    # http://search.cpan.org/~drolsky/DateTime-Format-Strptime-1.74/lib/DateTime/Format/Strptime.pm

    my ($rssTime) = @_;
    my $pattern = "%a, %d %b %Y %H:%M:%S %z";

    my $strp = DateTime::Format::Strptime->new(pattern => $pattern);
    my $dt = $strp->parse_datetime($rssTime);

    return $dt->dmy('.');
}

1;
