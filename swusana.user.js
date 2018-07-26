// ==UserScript==
// @name         Swusana
// @namespace    http://tampermonkey.net/
// @version      0.8.9
// @description  Asana Productivity Enhancements including - Noise Reduction.  Blackout periods.
// @author       will@sendwithus.com
// @match        https://app.asana.com/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.0/js.cookie.min.js
// ==/UserScript==

// TODO create some better buttons
var noiseButton = $('<a id="noiseButton" title="hide/show noise" class="NavigationLink Topbar-noiseButton swusana-button" href="javascript:;"><img height="24" src="https://image.flaticon.com/icons/png/128/699/699913.png"></a>');
var blackoutButton = $('<a id="blackoutButton" title="turn on/off blackout period" class="NavigationLink Topbar-blackoutButton swusana-button" href="javascript:;"><img height="24" src="https://cdn2.iconfinder.com/data/icons/picons-basic-2/57/basic2-108_user_remove-128.png"></a>');
var noiseButtonOn = false;
var blackoutButtonOn = false;
var blackoutProfileStyle = '';

$("head").append('<link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/tomorrow.min.css" rel="stylesheet" type="text/css">');


// ONLOAD
var buttonBarLocation = '.topbarHelpMenuButton';
$(document).ready(function(){
    waitForEl(buttonBarLocation, function(){
        $(buttonBarLocation).after(blackoutButton);
        $(buttonBarLocation).after(noiseButton);
        blackoutProfileStyle = $('.Topbar-accountInfo .Avatar').attr('style');

        // BLACKOUT TRIGGERS
        $('#blackoutButton').on('click', function(){
            blackoutButtonOn = !blackoutButtonOn;
            $(this).toggleClass('swusana-button-on');
            Cookies.set('blackoutButtonStatus', blackoutButtonOn, { expires: 365 });
            if (blackoutButtonOn) {
                var confirmed = confirm('Please carefully confirm.  Blackout is about to be turned on and you will be auto-unfollowed on every task you click on.\n\nClick OK to turn on.\nClick Cancel to turn off.');
                if (!confirmed){
                    blackoutButtonOn = !blackoutButtonOn;
                    Cookies.set('blackoutButtonStatus', blackoutButtonOn, { expires: 365 });
                    $(this).toggleClass('swusana-button-on');
                } else {
                    $('#blackoutButton img').attr('src', 'https://media.giphy.com/media/79VehauAiiSLS/giphy.gif');
                }
            } else {
                $('#blackoutButton img').attr('src', 'https://cdn2.iconfinder.com/data/icons/picons-basic-2/57/basic2-108_user_remove-128.png');
            }
        });

        if (Cookies.get('blackoutButtonStatus') === 'true'){
            $('#blackoutButton').trigger('click');
        }

        // NOISE TRIGGERS
        $('#noiseButton').on('click', function(){
            noiseButtonOn = !noiseButtonOn;
            $(this).toggleClass('swusana-button-on');
            Cookies.set('noiseButtonStatus', noiseButtonOn, { expires: 365 });
            $('.lunaui-grid-center-pane-container#center_pane_container').css({ 'max-width': '1000px !important'});
            if (!noiseButtonOn){
                $('.lunaui-grid-center-pane-container#center_pane_container').css({ 'max-width': '100% !important'});
                $('.swusana-noise').show();
                $('.swusana-noise').removeClass('swusana-noise-hidden');
            }
        });

        if (Cookies.get('noiseButtonStatus') === 'true'){
            $('#noiseButton').trigger('click');
        }
    });
});

// EVENT LOOP
setInterval(function() {
    // blackout loop
    if (blackoutButtonOn) {
        $('.RemovableAvatar-avatarRemoveButton').each(function(index,item){
            var followStyle = $(item).siblings('.Avatar').attr('style');
            if(blackoutProfileStyle.startsWith(followStyle.substring(0, followStyle.length - 13))) {
                $('.TaskFollowers-toggleButton span').trigger('click');
            }
        });
    }

    // Noise hiding loop
    if (noiseButtonOn) {
        $('.TaskStoryFeed-miniStory, .TaskList .Pill--colorNone, .TaskList .MiniHeartButton, .TaskStoryFeed-separator').not('.StoryFeed-topSeparator, .swusana-noise-hidden, .swusana-always-ignore').each(function(index,item){
            if ($(item).text().indexOf(' created ') !== -1 || $(item).text().indexOf(' duplicated ') !== -1) {
                $(item).addClass('swusana-always-ignore');
            } else {
                $(item).addClass('swusana-noise');
                $(item).addClass('swusana-noise-hidden');
                $(item).hide();
            }
        });
    }
}, 250);


function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

var waitForEl = function(selector, callback) {
  if (jQuery(selector).length) {
    callback();
  } else {
    setTimeout(function() {
      waitForEl(selector, callback);
    }, 100);
  }
};

// STYLE
var css =
    '.lunaui-grid-center-pane-container#center_pane_container { max-width: 100% !important}' +
    '.swusana-button { '+
        'border: 3px solid white;' +
        'margin-left:10px;' +
        'padding: 3px;' +
    '}' +
    '.StoryFeed-miniStory+.StoryFeed-blockStory { margin-top: 0 !important; }' +
    '.swusana-button-on { '+
        'border-bottom: 3px solid #AAAAAA;' +
    '}';
addGlobalStyle(css);
