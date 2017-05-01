// ==UserScript==
// @name        Steam Gifts Improver
// @namespace   SGImp
// @version     2.0.4
// @include     https://www.steamgifts.com/*
// @grant       none
// @author      Archer-Dante
// @updateURL   https://github.com/Archer-Dante/scriptlands/raw/master/SGImp.user.js
// @downloadURL https://github.com/Archer-Dante/scriptlands/raw/master/SGImp.user.js
// ==/UserScript==

$('ul.sidebar__navigation:nth-child(4) > li:nth-child(5)').remove();

var UserLvL = Math.floor($('.nav__right-container > div:nth-child(4) > a:nth-child(1) > span:nth-child(2)').attr('title'));
var gaLvL = UserLvL - 3;

$('.sidebar__navigation:first').append('\
<li class="sidebar__navigation__item">\
<a class="sidebar__navigation__item__link" href="/giveaways/search?level_min='+gaLvL+'&level_max='+UserLvL+'">\
<div class="sidebar__navigation__item__name">Levels '+gaLvL+'-'+UserLvL+'</div>\
<div class="sidebar__navigation__item__underline"></div>\
</a>\
</li>\
');

$('.sidebar__heading:last').before('<h3 class="sidebar__heading">By level</h3><ul class="sidebar__navigation SIGjs"></ul>')

for (var i=3; i < UserLvL+1; i++) {
$('.SIGjs').append('\
<li class="sidebar__navigation__item">\
<a class="sidebar__navigation__item__link" href="/giveaways/search?level_min='+i+'&level_max='+i+'">\
<div class="sidebar__navigation__item__name">Level '+i+'</div>\
<div class="sidebar__navigation__item__underline"></div>\
</a>\
</li>\
');
                                  }

