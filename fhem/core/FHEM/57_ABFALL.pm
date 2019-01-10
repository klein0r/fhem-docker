# $Id: 57_ABFALL.pm 11023 2018-06-13 12:34:34Z uniqueck $
###########################
#	ABFALL
#
#	needs a defined Device 57_Calendar
###########################
package main;

use strict;
use warnings;
use POSIX;
use Time::Local;
use Time::Piece;
use ABFALL_setUpdate;

sub ABFALL_Initialize($)
{
	my ($hash) = @_;

	$hash->{DefFn}   = "ABFALL_Define";
	$hash->{UndefFn} = "ABFALL_Undef";
	$hash->{SetFn}   = "ABFALL_Set";
	$hash->{AttrFn}   = "ABFALL_Attr";
	$hash->{NotifyFn}   = "ABFALL_Notify";

	$hash->{AttrList} = "abfall_clear_reading_regex "
		."disable:0,1 "
		."weekday_mapping calendarname_praefix:1,0 "
		."delimiter_text_reading "
		."delimiter_reading "
		."filter "
		."filter_type:include,exclude "
		."enable_counting_pickups:0,1 "
		."enable_old_readingnames:0,1 "
		."date_style:date,dateTime "
		.$readingFnAttributes;
}

sub ABFALL_Define($$){
	my ( $hash, $def ) = @_;
	my @a = split( "[ \t][ \t]*", $def );
	return "\"set ABFALL\" needs at least an argument" if ( @a < 3 );
	my $name = $a[0];

	my @calendars = split( ",", $a[2] );

	foreach my $calender (@calendars)
	{
		return "invalid calendername \"$calender\", define it first" if((devspec2array("NAME=$calender")) != 1 );
	}
	$hash->{KALENDER} 	= $a[2];
  $hash->{NOTIFYDEV}	= $a[2];
	$hash->{NAME} 	= $name;
	$hash->{STATE}	= "Initialized";

	# prüfen, ob eine neue Definition angelegt wird
	if($init_done && !defined($hash->{OLDDEF}))
	{
		# set default stateFormat
		$attr{$name}{"stateFormat"} = "next_text in next_days Tag(en)";
		# set calendarname_praefix
		$attr{$name}{"calendarname_praefix"} = "0" if(@calendars == 1);
		# set default weekday_mapping
		$attr{$name}{"weekday_mapping"} = "Sonntag Montag Dienstag Mittwoch Donnerstag Freitag Samstag";
		# set default delimiter_text_reading
		$attr{$name}{"delimiter_text_reading"} = " und ";
		# set default delimiter_reading
		$attr{$name}{"delimiter_reading"} = "|";
		# set default date_style
		$attr{$name}{"date_style"} = "date";
	}
	InternalTimer(gettimeofday()+2, "ABFALL_setUpdate", $hash, 0);
	return undef;
}

sub ABFALL_Undef($$){
	my ( $hash, $arg ) = @_;
	RemoveInternalTimer($hash);
	return undef;
}

sub ABFALL_Set($@){

	my ($hash, $name, $cmd, @val) = @_;
	my $arg = join("", @val);
	my $list = "";
	my $result = undef;
	$list .= "update:noArg" if($hash->{STATE} ne 'disabled');
	$list .= " clear:noArg count" if(AttrVal($name, "enable_counting_pickups","0"));

	if ($cmd eq "update") {
		ABFALL_setUpdate($hash);
	} elsif ($cmd eq "count") {
		$result = ABFALL_Count($hash, $arg);
	} elsif ($cmd eq "clear") {
		ABFALL_Clear($hash);
	} else {
		$result = "ABFALL_Set ($name) - Unknown argument $cmd or wrong parameter(s), choose one of $list";
	}
	return $result;
}

sub ABFALL_Clear($) {
	my ($hash) = @_;
	my $name = $hash->{NAME};
	fhem("deletereading $name .*_pickups", 1);
	fhem("deletereading $name .*_pickups_used", 1);
}


sub ABFALL_Count($$){
	my ($hash, $abfallArt) = @_;
	my $name = $hash->{NAME};
	my $result = undef;
	my $waste_pickup_used = ReadingsVal($name, $abfallArt . "_pickups_used", "-1");
	Log3 $name, 5, "ABFALL_Count $abfallArt: looking for reading \"$abfallArt"."_pickups_used\" = $waste_pickup_used";
	if ($waste_pickup_used eq "-1") {
		$result = "\"set $name count $abfallArt\" : unknown waste type $abfallArt";
	} else {
		$waste_pickup_used = $waste_pickup_used + 1;
		readingsSingleUpdate($hash, $abfallArt ."_pickups_used", $waste_pickup_used, "1");
	}
	return $result;
}

sub ABFALL_Attr(@) {
	my ($cmd,$name,$attrName,$attrVal) = @_;
	my $hash = $defs{$name};

	if ($cmd eq "set") {
		if ($attrName eq "weekday_mapping") {
			my @weekdayMappingSplitted = split( "\ ", $attrVal );
			if (int(@weekdayMappingSplitted) != 7) {
				Log3 $name, 4, "ABFALL_Attr ($name) - $attrVal is a wrong weekday_mapping format";
				return ("ABFALL_Attr: $attrVal is a wrong mapping format. Format is a array like this So Mo Di Mi Do Fr Sa");
			}
		} elsif ($attrName eq "abfall_clear_reading_regex") {
			eval { qr/$attrVal/ };
			if ($@) {
				Log3 $name, 4, "ABFALL_Attr ($name) - $attrVal invalid regex: $@";
				return "ABFALL_Attr ($name) - $attrVal invalid regex";
			}
		}

	}


	return undef;
}


sub ABFALL_Notify($$)
{
  my ($own_hash, $dev_hash) = @_;
  my $ownName = $own_hash->{NAME}; # own name / hash

  return "" if(IsDisabled($ownName)); # Return without any further action if the module is disabled

  my $devName = $dev_hash->{NAME}; # Device that created the events
  Log3 $ownName, 5,  "ABFALL_Notify($ownName) - Device: " . $devName;

  my @calendernamen = split( ",", $own_hash->{KALENDER});

  foreach my $calendar (@calendernamen){
		if ($devName eq $calendar) {
			foreach my $event (@{$dev_hash->{CHANGED}}) {
				if ($event eq "triggered") {
					Log3 $ownName , 3,  "ABFALL $ownName - CALENDAR:$devName triggered, updating ABFALL $ownName ...";
					ABFALL_setUpdate($own_hash);
				}
			}
		}
  }
  return undef;
}


1;
=pod

=begin html

<a name="ABFALL"></a>
<h3>ABFALL</h3>
<ul>
<br>
<a name="ABFALLdefine"></a>
<b>Define</b>
<ul>
	<code>define &lt;name&gt; ABFALL &lt;calendarname&gt;</code><br>
	<code>define &lt;name&gt; ABFALL &lt;calendarname&gt;,&lt;additional calendarname&gt;</code><br>
	<br>
	Defines a ABFALL device.<br>
	A ABFALL device creates events with deadlines based on one or more calendar-device (57_Calendar.pm). <br>
	You need to install the  perl-modul Date::Parse!<br>
</ul>
<br>
<a name="ABFALLset"></a>
<b>Set</b>
<ul>
	<code>set &lt;name&gt; update</code><br>
	Forces to read all events from the calendar-devices and create / update readings.<br>
</ul>
<br>
<a name="ABFALLattr"></a>
<b>Attributes</b>
<ul>
	<li><code>abfall_clear_reading_regex</code><br>
		regex to remove part of the summary text</li><p>
	<li><code>weekday_mapping</code><br>
		mapping for the days of week
	</li><p>
	<li><code>calendarname_praefix </code><br>
		add calendar name as praefix for reading</li><p>
	<li><code>delimiter_text_reading</code><br>
			delimiter for join events on same day for readings now_text and next_text</li><p>
	<li><code>delimiter_reading </code><br>
			delimiter for join reading name on readings now and next</li><p>
	<li><code>filter</code><br>
			filter to skip or keep events, possible values regex or string with event name parts</li><p>
	<li><code>filter_type</code><br>
			skip events or keep events with filter, default value is include this mean keep</li><p>
	<li><a href="#readingFnAttributes">readingFnAttributes</a></li>
</ul>
<br>
<b>Examples</b>
<ul>
	see <a href="https://wiki.fhem.de/wiki/ABFALL">FHEM Wiki</a>
<br>
</ul>
</ul>
=end html

=begin html_DE

<a name="ABFALL"></a>
<h3>ABFALL</h3>
<ul>
	<br>
	<a name="ABFALLdefine"></a>
	<b>Define</b>
	<ul>
		<code>define &lt;name&gt; ABFALL &lt;Kalendername&gt;</code><br>
		<code>define &lt;name&gt; ABFALL &lt;Kalendername&gt;,&lt;weiterer Kalendername&gt;</code><br>
		<br>
		Definiert ein Abfall-Device.<br><br>
		Ein Abfall-Device ermittelt, basierend auf einem oder mehreren Kalender-Devices, Termine und stellt verschiedene 'Readings' hierfür bereit.<br>
		Das Perl Modul Date::Parse muss installiert sein!<br>
	</ul>
	<br>
	<a name="ABFALLset"></a>
	<b>Set</b>
	<ul>
		<code>set &lt;name&gt; update</code><br>
		Erzwingt das Auslesen der Kalender-Devices und neuerstellen der Readings.<br><br>
		<code>set &lt;name&gt; count &lt;abfallArt&gt;</code><br>
		Steht nur zur Verfügung wenn das Attribut <code>enable_counting_pickups</code> auf 1 steht.<br>
		Erhöht das Reading <code>&lt;abfallArt&gt;_pickups_used</code> um 1, sofern die <code>AbfallArt</code> als Reading existiert.<br><br>
		<code>set &lt;name&gt; clear</code><br>
		Steht nur zur Verfügung wenn das Attribut <code>enable_counting_pickups</code> auf 1 steht.<br>
		Löscht alle Readings <code>*_pickups_used</code> und <code>*_pickups</code>
	</ul>
	<br>
	<a name="ABFALLattr"></a>
	<b>Attribute</b>
	<ul>
		<li><code>abfall_clear_reading_regex</code><br>
			regulärer Ausdruck zum Entfernt eines Bestandteils des Terminnamens</li><p>
		<li><code>weekday_mapping</code><br>
			Mapping der Wochentag</li><p>
		<li><code>calendarname_praefix</code><br>
			soll der <code>calendarname</code> als Präfix im reading geführt werden</li><p>
		<li><code>delimiter_text_reading</code><br>
			Trennzeichen(kette) zum Verbinden von Terminen, wenn sie auf den gleichen Tag fallen
			gilt nur für die Readings next_text und now_text</li><p>
		<li><code>delimiter_reading</code><br>
			Trennzeichen(kette) zum Verbinden von Terminen, wenn sie auf den gleichen Tag fallen
			gilt nur für die readings next und now</li><p>
		<li><code>filter</code><br>
			Zeichenkette zum Ausfiltern der Events aus den Kalendern, es sind auch regex möglich</li><p>
		<li><code>filter_type</code><br>
			Sollen durch den angegebene Filter Termine entfernt werden, oder erhalten bleiben</li><p>
		<li><code>date_style</code><br>
			Soll das Datum mit Uhrzeit oder ohne Uhrzeit angezeigt werden</li><p>
		<li><code>enable_old_readingnames</code><br>
			Stellt die Readings *_wochtag, *_datum und *_tage zur Verfügung, allerdings
			ist dieses Attribut deprecated, wird also in einer der folgenden Version entfernt, so dass dann diese Readings nur noch
			mit ihren englischen Varianten zur Verfügung stehen.
		</li><p>
		<li><code>enable_counting_pickups</code><br>
			Hiermit werden die Abholungen gezählt und es kann mit Milfe von <code>set &lt;name&gt; count &lt;abfallArt&gt;</code> die genutzte Abholung
			gezählt werden. Mit Hilfe von <code>set &lt;name&gt; clear</code> können die Abholungen wieder auf 0 gesetzt werden. Das ist sinnvoll bei Wechsel
			eines Abrechnungszeitraum.
		</li><p>
		<li><a href="#readingFnAttributes">readingFnAttributes</a></li>
	</ul>
	<br>
	<b>Anwendungsbeispiele</b>
	<ul>
		siehe h<a href="https://wiki.fhem.de/wiki/ABFALL">FHEM Wiki</a>
	<br>
	</ul>
	</ul>
=end html_DE
=cut
