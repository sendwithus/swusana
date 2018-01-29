// ==UserScript==
// @name         Asana Github Markdown
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replaces comments and description with markdown interpretation.  Hides the noise.  Show it all by clicking on the description icon
// @author       will@sendwithus.com
// @match        https://app.asana.com/*
// @grant        none
// @require http://code.jquery.com/jquery-1.12.4.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/showdown/1.8.6/showdown.min.js
// ==/UserScript==
var converter = new showdown.Converter({tables: true, strikethrough: true});
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
var myCss =
    '.markdowned { '+
        'white-space: normal !important; ' +
        'background-color: #FaFaFa !important;' +
        'color: #666666; '+
        'padding-left: 10px;' +
        'padding-right: 10px;' +
        'padding-top: 5px;' +
        'padding-bottom: 5px;' +
        'border-left: 4px solid #EEEEEE !important; ' +
        'display: block !important; ' +
    '}' +
    '#description-markdown { ' +
        'border-top: 1px solid #eeeeee;' +
        'border-bottom: 1px solid #eeeeee;' +
        'border-right: 1px solid #eeeeee;' +
    '}' +
    '.notagain { padding: 10px; border:1px solid #999999; }' +
    '.markdowned p { margin-top: 5px; }' +
    '.markdowned table { ' +
        'margin-top: 10px;' +
        'margin-bottom: 10px;' +
    '}' +
    '.markdowned td, .markdowned th { ' +
        'border-left: 1px solid #AAAAAA;' +
        'padding-right: 5px; ' +
        'padding-left: 4px; ' +
    '}' +
    '.markdowned td { ' +
        'border-top: 1px solid #AAAAAA;' +
    '}' +
    '.markdowned blockquote { ' +
        'border-left: 4px solid #8888FF;' +
        'padding-left:10px;' +
        'white-space: normal;' +
    '}' +
    '.markdowned blockquote p { ' +
        'margin: 0' +
    '}' +
    '.markdowned h6 { font-size:1em; font-weight: bold; margin-top: 3px; margin-bottom: 1px; }' +
    '.markdowned h5 { font-size:1.2em; margin-top: 4px; margin-bottom: 1px; }' +
    '.markdowned h4 { font-size:1.4em; margin-top: 5px; margin-bottom: 2px; }' +
    '.markdowned h3 { font-size:1.6em; margin-top: 6px; margin-bottom: 3px; }' +
    '.markdowned h2 { font-size:1.8em; margin-top: 7px; margin-bottom: 4px; }' +
    '.markdowned h1 { font-size:2em; margin-top: 8px; margin-bottom: 5px; }';

addGlobalStyle(myCss);

$(document).on('click', '.SingleTaskPane-descriptionLabel', function(){
    $('.toggleable').toggle('slide');
});


var pmInt = setInterval(function() {
    $('.RichText').not('.markdowned, .notagain').each(function(index, item){
        var md = $(item).html().replace(/<br>/g, '\n');
        var html = '<div class="markdowned">' + converter.makeHtml(md) + '</div>';
        $(item).before(html);
        $(item).addClass('notagain');
        $(item).addClass('toggleable');
        $(item).hide();
    });

    $('.SingleTaskPane-description, .StoryFeed-miniStory').not('.toggleable').each(function(index,item){
        $(item).addClass('toggleable');
        $(item).hide();
    });

    if ($('#TaskDescription-textEditor').html()) {
        var md = '';
        $('*', $('#TaskDescription-textEditor')).each(function(index, item){
            md += $(item).text() + '\n';
        });
        var html = converter.makeHtml(md);
        if (!$('#description-markdown').length) {
            $('.SingleTaskPane-descriptionRow').before('<div id="description-markdown" class="markdowned RichText"></div>');
        }
        $('#description-markdown').html(html);
    }
}, 1000);

