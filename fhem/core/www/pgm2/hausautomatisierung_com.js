
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

    var themeVersion = '2.14';

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
    $('#logo').append(
        $('<span class="theme-version">' + themeVersion + '</span>')
    ).append(
        $('<span id="clock"></span>')
    );

    // Add clock
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

    $('input[type=text][name=icon-filter]').keyup(function() {
        var val = $(this).val().toLowerCase();
        if (val.length === 0) {
            jQuery('button.dist').show();
        } else {
            jQuery('button.dist').hide().filter(function() {
                return $(this).attr('title').toLowerCase().indexOf(val) > -1;
            }).show();
        }
    });

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
        //don't hide anything
    } else {
        $('div.devType:contains("-hidden")').parent('td').hide();
    }

    // DevToolTips
    // Create Toolbar
    var elHaToolbar = $('<div>').attr('id', 'haToolbar').hide();
    $('body').append(elHaToolbar);

    $('table.internals .dname').click(function (e) {
        var deviceName = $(this).attr('data-name');
        var rowVal = $(this).text();

        if ($(this).html() == "TYPE") {
            elHaToolbar.html(("GetType('" + deviceName + "');")).show();
        } else if ($(this).html() == "STATE") {
            elHaToolbar.html("Value('" + deviceName + "');").show();
        } else {
            elHaToolbar.html("InternalVal('" + deviceName + "', '" + rowVal + "', '');").show();
        }
    });

    $('table.readings .dname').click(function (e) {
        var deviceName = $(this).attr('data-name');
        var rowVal = $(this).text();

        elHaToolbar
            .html(
                "ReadingsVal('" + deviceName + "', '" + rowVal + "', '');<br/>" +
                "[" + deviceName + ":" + rowVal + "]<br/>" +
                deviceName + ":" + rowVal + ":.*"
            )
            .show();
    });

    $('table.attributes .dname').click(function (e) {
        var deviceName = $(this).attr('data-name');
        var rowVal = $(this).text();

        elHaToolbar.html("AttrVal('" + deviceName + "', '" + rowVal + "', '');").show();
    });

    // Group attributes
    var attrSelect = $('select.attr');
    var attrList = new Object();
    attrList['general'] = ['userattr', 'verbose', 'disable', 'useSetExtensions', 'setList', 'disabledForIntervals', 'showtime'];
    attrList['readings'] = ['userReadings',  'oldreadings', 'suppressReading', 'readingList'];
    attrList['msg'] = ['msgContactAudio', 'msgContactLight', 'msgContactMail', 'msgContactPush', 'msgContactScreen', 'msgParams', 'msgPriority', 'msgRecipient', 'msgRecipientAudio', 'msgRecipientLight', 'msgRecipientMail', 'msgRecipientPush', 'msgRecipientScreen', 'msgRecipientText', 'msgTitle', 'msgTitleShrt', 'msgType'];
    attrList['events'] = ['event-aggregator', 'event-min-interval', 'event-on-change-reading', 'event-on-update-reading', 'eventMap', 'timestamp-on-change-reading', 'setExtensionsEvent'];
    attrList['fhemweb'] = ['alias', 'comment', 'cmdIcon', 'devStateIcon', 'devStateStyle', 'group', 'icon', 'room', 'sortby', 'stateFormat', 'webCmd', 'webCmdLabel', 'widgetOverride'];
    attrList['floorplan'] = ['fp_arrange', 'fp_backgroundimg', 'fp_default', 'fp_noMenu', 'fp_roomIcons', 'fp_setbutton', 'fp_viewport'];
    attrList['database'] = ['DbLogExclude', 'DbLogInclude'];

    var optGroups = new Object();
    optGroups['device'] = $('<optgroup label="device"></optgroup>');
    for (var attrGroup in attrList) {
        optGroups[attrGroup] = $('<optgroup label="' + attrGroup + '"></optgroup>');
    }

    if (attrSelect) {
        // clear the original list
        var attributeOptionList = attrSelect.children();
        var selectedItem = attrSelect.find('option:selected');
        attrSelect.empty();

        // add attributes to predefined optgroups
        attributeOptionList.each(function(i, e) {
            var found = false;
            for (var attrGroup in attrList) {
                if (attrList[attrGroup].indexOf($(e).attr('value')) > -1) {
                    optGroups[attrGroup].append(e);
                    found = true;
                }
            }

            if (!found) {
                optGroups['device'].append(e);
            }
        });

        // add optgroups to select
        for (var optGroup in optGroups) {
            if (optGroups[optGroup].children().length) {
                attrSelect.append(optGroups[optGroup]);
            }
        };

        // select previously selected item
        selectedItem.prop('selected', true);
    }

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
