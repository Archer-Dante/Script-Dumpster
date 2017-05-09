// ==UserScript==
// @name        Lowadi Multi-Account Sausage Farm
// @namespace   LMASF
// @description Делаем вкусную колбаску
// @version     1.2
// @grant       none
// @match       http://www.lowadi.com/*
// @match       https://www.lowadi.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require		https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min.js
// @downloadURL https://github.com/Haibane-Kira/Script-Dumpster/raw/master/Lowadi_Multi-Account_Sausage_Farm.user.js
// @run-at document-end
// ==/UserScript==


var login			 =	[				// логины
						'Логин 1',
						'Логин 2',
						'Логин 3'
						];
	
var pass	 		=	[				// пароли
						'Пароль 1',
						'Пароль 2',
						'Пароль 3'
						];

var firstHorseID	=	[				// ID с каких лошадей начинать
						'Конь 1',
						'Конь 2',
						'Конь 3'
						];

var pageLifetime	=	30; // количество секунд простоя на странице, прежде чем скрипт выйдет с аккаунта

/* ======================================================================== */
var currentAccount	=	Cookies.get('LMASF');
var currentAccount	=	Number(currentAccount);
var currentAccountMessage;

if(isNaN(currentAccount)){
console.log("Нет активного аккаунта");
currentAccountMessage = 'нет';
}else {
console.log("Активный аккаунт: #" + currentAccount);
currentAccountMessage = currentAccount + 1;	
	if (currentAccountMessage > login.length) {
		currentAccountMessage = 'всё';
	}
}

// Проверка условий когда совершать автоматический переход
var page = window.location.href;

if(page.indexOf('lowadi.com/jeu') > 0){
	window.location.href = "https://www.lowadi.com/elevage/chevaux/cheval?id="+firstHorseID[currentAccount]; // из-за того
}

// Добавочный интерфейс
if($('.landing-register').length){
	addInterface();
}else{
	addInterface();
	$('.grinder strong').text('Уже в аккаунте').css("color","#B0BEC5").css("cursor","default");
	$('.grinder').removeClass("header-login-button grinder").css("color","black");
}

function addInterface(){
$('head').after('\
<div style="display:block;position:fixed;top:40%;left:5px;background:rgba(50,122,240,0.6);;border:1px solid;width:160px;z-index:666" class="sausage-menu">\
<nav class="header-login float-right">\
<div class="header-login-button grinder" style="margin: 5px 0">\
<a><strong class="header-login-label">Делать колбасу</strong></a>\
</div></nav>\
<br><span style="color:#fff;margin:0 20%"><i>Аккаутов: '+login.length+'</i></span>\
<br><span style="color:#fff;margin:0 20%"><i>Текущий: '+currentAccountMessage+'</i></span>\
<div class="header-login-button extra-stop" style="margin: 5px 0"><a><strong class="header-login-label">Сброс</strong></a></div>\
</div>\
');
}

$('.extra-stop').click(function(){
	removeAllCookies();
	Cookies.remove('LMASF');
	console.log("Сброшено");
	$(this).after('<span class="delete-me" style="color:#fff;margin:0 30%"><i>Сброшено</i></span>');
	setTimeout(function(){$('.delete-me').remove()},1500);
	window.location.href = "https://www.lowadi.com/site/logIn";
});

// От оповещений о cookie
$('.panel-cookies').hide();


// Считывание клика и запуск процедур
$('.grinder').click(function() {
	/* Удаляем старые записи */
	removeAllCookies();
	// Антибаг
	if(isNaN(currentAccount)){
		Cookies.set('LMASF','0',{expires:1});
		currentAccount	=	Cookies.get('LMASF');
		currentAccount	=	Number(currentAccount);
	}
	/* Если мы уже в процессе - просто авторизуемся снова */
	if(currentAccount >= 0){
		Autorisation();
	}
});

// Автоматический клик, если скрипт в работе
setTimeout(function(){
	if(currentAccount > login.length ){
		Cookies.remove("LMASF");
		console.log("Работа завершена: cookie-счётчик удалён");
	}else if(currentAccount >= 0){
		$('.grinder').click();
	}
},2500);



/* Функция для ввода данных и авторизации с ними */
function Autorisation(){
	$('#login').attr('value',login[currentAccount]);
	$('#password').attr('value',pass[currentAccount]);
	setTimeout(function () {
	  $('#authentificationSubmit').click();
	}, 1500);
}



// Поправка времени вне глаз пользователя
var pageLifetime = pageLifetime*1000;


setTimeout(function() {
	if(currentAccount >= 0){
	
			currentAccount = currentAccount + 1;
			if(currentAccount > login.length){
				Cookies.remove("LMASF");
				console.log("Работа завершена: cookie-счётчик удалён");
			}else{
				console.log("Следующий аккаунт: " + currentAccount);
				Cookies.set('LMASF',currentAccount,{expires:1});
			}
			$("a[title='Выйти']").click();

	}
}, pageLifetime);




/* Удалялка всех Cookie связанных с сайтом + отчёт в консоль */
function removeAllCookies() {
    var allCookies = Cookies.get(), allCookies = Object.keys(allCookies);
    console.log("Всего " + allCookies.length + " cookie записей");
    for (x = 0; x < allCookies.length; x++) {
    	console.log("Удаление cookie: " + allCookies[x]);
    	Cookies.remove(allCookies[x], { domain:'.www.lowadi.com'});
    	Cookies.remove(allCookies[x], { domain:'.lowadi.com'});
    }
    var allCookies = Cookies.get(), allCookies = Object.keys(allCookies);
    console.log("Осталось " + allCookies.length + " cookie записей");
}
