
function getClock() {
    var d = new Date();
    nhour = d.getHours();
    nmin = d.getMinutes();

    if (nhour <= 9) {
        nhour = '0' + nhour;
    }

    if (nmin <= 9) {
        nmin = '0' + nmin;
    }

    document.getElementById('clock').innerHTML = nhour + ':' + nmin + ' Uhr';

    setTimeout(getClock, 1000);
}

jQuery(document).ready(function ($) {

    var themeVersion = '2.19';

    // attr WEB hiddenroom input -> Ansicht anpassen
    if ($('#hdr .maininput').length == 0) {
        $('#hdr').hide();
        $('#content').css({top: '10px'});
    } else {
        // Link mit Popup Button
        $('<div class="maininputPopupLink"></div>')
            .appendTo("#hdr")
            .click(function () {
                var hasCodeMirror = typeof AddCodeMirror == 'function';

                var textArea = $('<textarea rows="20" cols="60" style="width: 99%; ' + (hasCodeMirror ? 'opacity: 0;' : '') + '"/>');
                if (hasCodeMirror) {
                    AddCodeMirror(textArea, function(cm) { 
                        cm.on("change", function() { textArea.val(cm.getValue()) } );
                    });
                }

                $('<div title="Multiline Command"></div>')
                    .append(textArea)
                    .dialog({
                        modal: true,
                        width: $(window).width() * 0.9,
                        buttons: [
                            {
                                text: "Execute",
                                click: function() {
                                    FW_execRawDef(textArea.val());
                                }
                            }
                        ],
                        close: function() {
                            $(this).remove();
                        }
                    });
            });
    }

    // Add version to logo
    $('#logo').append($('<span class="theme-version">' + themeVersion + '</span>'));

    // Add clock
    $('#logo').append($('<span id="clock"></span>'));
    window.addEventListener('load', getClock, false);

	// Clear spaces
    $('#content .devType, #menu .room a').each(function() {
        $(this).html($(this).html().replace(/&nbsp;/g, ''));
    });

    $('#content > br').remove();
    $('.makeSelect').parent().find('br').remove();

    // Add missing classes for elements
    $('.SVGplot').prevAll('a').addClass('plot-nav');

    // Icon selection
    $('button.dist').wrapAll('<div class="icons"/>');
    $('button.dist').css({width: '50px', height: '50px', margin: '5px', padding: '0'});
    $('button.dist > *').css({maxWidth: '40px', maxHeight: '40px', display: 'block', margin: '0px auto'});

    // Links in der Navigation hinzufügen
    var navElement = jQuery('#menu .room').last().find('tbody');
    navElement.append(
        $('<tr><td><div><a class="custom-menu-entry" href="https://github.com/klein0r/fhem-style-haus-automatisierung/issues/">Theme-Fehler melden (v' + themeVersion + ')</a></div></td></tr>')
    );

    // Automatische Breite für HDR Input
    function resizeHeader() {
        var baseWidth = $('#content').length ? $('#content').width() : $(window).width() - $('#menuScrollArea').width() - 30;

        $('#hdr').css({width: baseWidth + 'px'});
        $('.maininput').css({width: ($('#hdr').width() - $('.maininputPopupLink').outerWidth() - 4) + 'px'});
    }
    resizeHeader();
    $(window).resize(resizeHeader);

    // Klick auf Error-Message blendet diese aus
    $('body').on('click', '#errmsg', function() {
        $(this).hide();
    });

    $('.roomoverview .col1, .makeTable .col1').each(function(index) {
        $(this).parent().addClass('first-table-column');
    });

    // hide elements by name
    if (document.URL.indexOf('showall') != -1) {
        // don't hide anything
    } else {
        $('div.devType:contains("-hidden")').parent('td').hide();
    }

    // DevToolTips
    // Create Toolbar
    var elHaToolbar = $('<div>').attr('id', 'haToolbar').hide();
    $('body').append(elHaToolbar);

    $('#haToolbar').on('click', '.toHdr', function() {
        $('input.maininput').val($(this).text()).change();
    });

    function addToToolbar(val) {
        if (val.length > 0) {
            elHaToolbar.empty();
            jQuery.each(val, function(i, v) {
                $('<span>').addClass('toHdr').text(v).appendTo(elHaToolbar);
                $('<br>').appendTo(elHaToolbar);
            });
            elHaToolbar.show();
        }
    }

    $('table.internals .dname').click(function (e) {
        var deviceName = $(this).attr('data-name');
        var rowVal = $(this).text();

        if ($(this).html() == "TYPE") {
            addToToolbar(
                [
                    "GetType('" + deviceName + "');",
                    "InternalVal('" + deviceName + "', '" + rowVal + "', '');",
                    "[i:" + deviceName + ":TYPE]"
                ]
            );
        } else if ($(this).html() == "STATE") {
            addToToolbar(
                [
                    "Value('" + deviceName + "');",
                    "InternalVal('" + deviceName + "', '" + rowVal + "', '');",
                    "[i:" + deviceName + ":STATE]"
                ]
            );
        } else {
            addToToolbar(
                [
                    "InternalVal('" + deviceName + "', '" + rowVal + "', '');",
                    "[i:" + deviceName + ":" + rowVal + "]"
                ]
            );
        }
    });

    $('table.readings .dname').click(function (e) {
        var deviceName = $(this).attr('data-name');
        var rowVal = $(this).text();

        addToToolbar(
            [
                "ReadingsVal('" + deviceName + "', '" + rowVal + "', '');",
                "[" + deviceName + ":" + rowVal + "]",
                "[r:" + deviceName + ":" + rowVal + "]",
                deviceName + ":" + rowVal + ":.*"
            ]
        );
    });

    $('table.attributes .dname').click(function (e) {
        var deviceName = $(this).attr('data-name');
        var rowVal = $(this).text();

        addToToolbar(
            [
                "AttrVal('" + deviceName + "', '" + rowVal + "', '');",
                "[a:" + deviceName + ":" + rowVal + "]",
                "global:ATTR." + deviceName + "." + rowVal + ".*"
            ]
        );
    });

    (function($, window, document, undefined) {
        'use strict';

        var elSelector = '#hdr, #logo',
            elClassHidden = 'header--hidden',
            throttleTimeout = 50,
            $element = $(elSelector);

        if (!$element.length) return true;

        var $window = $(window),
            wHeight = 0,
            wScrollCurrent = 0,
            wScrollBefore = 0,
            wScrollDiff = 0,
            $document = $(document),
            dHeight = 0,
            throttle = function(delay, fn) {
                var last, deferTimer;
                return function() {
                    var context = this, args = arguments, now = +new Date;
                    if (last && now < last + delay) {
                        clearTimeout(deferTimer);
                        deferTimer = setTimeout(
                            function() {
                                last = now;
                                fn.apply(context, args);
                            },
                            delay
                        );
                    } else {
                        last = now;
                        fn.apply(context, args);
                    }
                };
            };

        $window.on('scroll', throttle(throttleTimeout, function() {
            dHeight = $document.height();
            wHeight	= $window.height();
            wScrollCurrent = $window.scrollTop();
            wScrollDiff = wScrollBefore - wScrollCurrent;

            if (wScrollCurrent <= 50) {
                $element.removeClass(elClassHidden);
            } else if (wScrollDiff > 0 && $element.hasClass(elClassHidden)) {
                $element.removeClass(elClassHidden);
            } else if (wScrollDiff < 0) {
                if (wScrollCurrent + wHeight >= dHeight && $element.hasClass(elClassHidden)) {
                    $element.removeClass(elClassHidden);
                } else {
                    $element.addClass(elClassHidden);
                }
            }

            wScrollBefore = wScrollCurrent;
        }));

    })(jQuery, window, document);
});
