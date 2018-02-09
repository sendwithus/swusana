// ==UserScript==
// @name         Swusana
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Asana Productivity Enhancements including - Noise Reduction.  Github Markdown support.
// @author       will@sendwithus.com
// @match        https://app.asana.com/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.0/js.cookie.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/he/1.1.1/he.min.js
// ==/UserScript==

// TODO create some buttons
var noiseButton = $('<a id="noiseButton" class="NavigationLink Topbar-noiseButton swusana-button" href="javascript:;"><img height="24" src="https://image.flaticon.com/icons/png/128/699/699913.png"></a>');
var markdownButton = $('<a id="markdownButton" class="NavigationLink Topbar-markdownButton swusana-button" href="javascript:;"><img height="24" src="https://cdn.iconscout.com/public/images/icon/premium/png-256/markdown-38571562f3f0d3e5-256x256.png"></a>');
var blackoutButton = $('<a id="blackoutButton" class="NavigationLink Topbar-blackoutButton swusana-button" href="javascript:;"><img height="24" src="https://cdn2.iconfinder.com/data/icons/picons-basic-2/57/basic2-108_user_remove-128.png"></a>');

// GLOBAL THINGS
var converter = new showdown.Converter({tables: true, strikethrough: true});

// STYLE
var css =
    '.swusana-button { '+
        'border: 3px solid white;' +
        'margin-right:5px;' +
        'margin-bottom:2px;' +
        'padding: 3px;' +
    '}' +
    '.swusana-button-on { '+
        'border-bottom: 3px solid #AAAAAA;' +
    '}' +
    '.swusana-markdown { '+
        'white-space: normal !important; ' +
        'background-color: #FaFaFa !important;' +
        'color: #666666; '+
        'padding-left: 10px;' +
        'padding-right: 10px;' +
        'padding-top: 5px;' +
        'padding-bottom: 5px;' +
        'border-left: 4px solid #EEEEEE !important; ' +
        'display: block; ' +
    '}' +
    '#description-markdown { ' +
        'border-top: 1px solid #eeeeee;' +
        'border-bottom: 1px solid #eeeeee;' +
        'border-right: 1px solid #eeeeee;' +
    '}' +
    '.swusana-markdown p { margin-top: 5px; }' +
    '.swusana-markdown table { ' +
        'margin-top: 10px;' +
        'margin-bottom: 10px;' +
    '}' +
    '.swusana-markdown td, .swusana-markdown th { ' +
        'border-left: 1px solid #AAAAAA;' +
        'padding-right: 5px; ' +
        'padding-left: 4px; ' +
    '}' +
    '.swusana-markdown td { ' +
        'border-top: 1px solid #AAAAAA;' +
    '}' +
    '.swusana-markdown blockquote { ' +
        'border-left: 4px solid #8888FF;' +
        'padding-left:10px;' +
        'white-space: normal;' +
    '}' +
    '.swusana-markdown blockquote p { ' +
        'margin: 0' +
    '}' +
    '.swusana-markdown ul li, .swusana-markdown ol li { ' +
        'margin-left:25px;' +
        'line-height: 1.2em;' +
    '}' +
    '.swusana-markdown ul li { ' +
        'list-style-type: disc;' +
    '}' +
    '.swusana-markdown ol li { ' +
        'list-style-type: decimal;' +
    '}' +
    '.swusana-markdown h6 { font-size:1em; font-weight: bold; margin-top: 3px; margin-bottom: 1px; }' +
    '.swusana-markdown h5 { font-size:1.2em; margin-top: 4px; margin-bottom: 1px; }' +
    '.swusana-markdown h4 { font-size:1.4em; margin-top: 5px; margin-bottom: 2px; }' +
    '.swusana-markdown h3 { font-size:1.6em; margin-top: 6px; margin-bottom: 3px; }' +
    '.swusana-markdown h2 { font-size:1.8em; margin-top: 7px; margin-bottom: 4px; }' +
    '.swusana-markdown h1 { font-size:2em; margin-top: 8px; margin-bottom: 5px; }';
addGlobalStyle(css);

// EVENT LOOP
setInterval(function() {
  // Noise hiding loop
  if (noiseButtonOn) {
    $('.StoryFeed-miniStory, .TaskList .Pill--colorNone, .MiniHeartButton').not('.swusana-noise-hidden').each(function(index,item){
      $(item).addClass('swusana-noise');
      $(item).addClass('swusana-noise-hidden');
      $(item).hide();
    });
  }

  // Markdown loop
  $('.RichText').not('.swusana-markdown-comment-original').each(function(index, item){
    var md = $(item).html().replace(/<br>/g, '\n');
    md = he.decode(md);
    var html = '<div class="swusana-markdown swusana-markdown-comment" ' + (markdownButtonOn ? '' : 'style="display:none;"') + '>' + converter.makeHtml(md) + '</div>';
    $(item).before(html);
    $(item).addClass('swusana-markdown-comment-original');
    if (markdownButtonOn) {
      $(item).hide();
    }
  });

}, 250);


//$('.Topbar-myDashboardButton').after(blackoutButton);
$('.Topbar-myDashboardButton').after(markdownButton);
$('.Topbar-myDashboardButton').after(noiseButton);

var noiseButtonOn = false;
var markdownButtonOn = false;
var blackoutButtonOn = false;

// NOISE TRIGGERS
$('#noiseButton').on('click', function(){
  noiseButtonOn = !noiseButtonOn;
  $(this).toggleClass('swusana-button-on');
  Cookies.set('noiseButtonStatus', noiseButtonOn, { expires: 365 });
  if (!noiseButtonOn){
    $('.swusana-noise').show();
    $('.swusana-noise').removeClass('swusana-noise-hidden');
  }
});

if (Cookies.get('noiseButtonStatus') === 'true'){
  $('#noiseButton').trigger('click');
}

// MARKDOWN TRIGGERS
$('#markdownButton').on('click', function(){
  markdownButtonOn = !markdownButtonOn;
  $(this).toggleClass('swusana-button-on');
  Cookies.set('markdownButtonStatus', markdownButtonOn, { expires: 365 });
  if (!markdownButtonOn){
      $('.swusana-markdown-comment-original').show();
      $('.swusana-markdown-comment').hide();
  } else {
      $('.swusana-markdown-comment-original').hide();
      $('.swusana-markdown-comment').show();
  }
});
if (Cookies.get('markdownButtonStatus') === 'true'){
  $('#markdownButton').trigger('click');
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
