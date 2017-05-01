// ==UserScript==
// @name        Lowadi Multi-Account Sausage Farm
// @namespace   LMASF
// @description Делаем вкусную колбаску
// @version     1.0
// @grant       none
// @match       http://www.lowadi.com/*
// @match       https://www.lowadi.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require	https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.1.4/js.cookie.min.js
// @downloadURL https://github.com/Archer-Dante/scriptlands/raw/master/Lowadi_Multi-Account_Sausage_Farm.user.js
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
						]

var pageLifetime	=	30; // количество секунд простоя на странице, прежде чем скрипт выйдет с аккаунта

/* ======================================================================== */
var currentAccount	=	Cookies.get('LMASF');
var currentAccount	=	Number(currentAccount);

if(isNaN(currentAccount)){
console.log("Нет активного аккаунта");
}else {
console.log("Активный аккаунт: #" + currentAccount);	
}

// Проверка условий когда совершать автоматический переход
var page = window.location.href;

if(page.indexOf('lowadi.com/jeu') > 0){
	window.location.href = "https://www.lowadi.com/elevage/chevaux/cheval?id="+firstHorseID[currentAccount]; // из-за того
}

// Добавочный интерфейс
if($('.landing-register').length){
	addInterface();
}

function addInterface(){
$('.header-logo').before('\
<nav class="header-login float-right" style="margin:0 5px;">\
<div class="header-login-button grinder">\
<a><strong class="header-login-label">Делать колбасу<br><i>Аккаутов: '+login.length+'</i></strong></a>\
</div></nav>\
');
}

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
		Autorisaion();
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
function Autorisaion(){
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














