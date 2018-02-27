// ==UserScript==
// @name		Archer's OVH Enhancer
// @namespace		OVH_ENH
// @description 	bunch of tools for OVH and shops
// @include		http://steamkeys.ovh/*
// @include		https://steamkeys.ovh/*
// @include		*/order/get/*
// @version		1.06
// @grant		none
// @run-at		document-idle
// @author		Archer-Dante
// ==/UserScript==

// авто-заполнение и авто-клик в полях заполнения почты при получении товара с магазов на OVH
if ((location.href).indexOf("/order/get/") > 0) {
    var abc = document.getElementsByClassName("form-control");
    abc[0].value = "xxx@gmail.com"; // вписать e-mail
    var def = document.getElementsByClassName("btn-default");
    def[0].click();
}

// форматирование и считалка для OVH
//if ((location.href).indexOf("steamkeys.ovh") > 0) {
    console.log("Открыт подходящий URL: " + location.href);
    var temp_rate = 15,
        temp_kSell = 100,
        temp_kPrice = 149,
        temp_accs = 100,
        deals_info = $('#DataTables_Table_0_info').html(),
        deals_text = 'of ',
        deals_pos1 = deals_info.indexOf(deals_text) + deals_text.length,
        deals_pos2 = deals_info.indexOf(' ', deals_pos1) - deals_pos1,
        deals_left = deals_info.substr(deals_pos1, deals_pos2);
  		  $('#buttons center').append('<div class="btn" id="hks" style="background:#9e1f1f">Рассчитать<br>профит</div>');
   		 $('#buttons center').append('<div class="btn" id="hks_forms" style="background:#9e1f1f;width:130px;font-size:0.9em;cursor:default">Рейт продажи сета<br><input id="sets_rate" type="text" size="14" placeholder="Рейт продажи сета" value="' + temp_rate + '"></div>')
   		 $('#buttons center').append('<div class="btn" id="hks_forms" style="background:#9e1f1f;width:130px;font-size:0.9em;cursor:default">Цена продажи ключа<br><input id="sell_key_price" type="text" size="14" placeholder="Цена продажи ключа" value="' + temp_kSell + '"></div>')
  		  $('#buttons center').append('<div class="btn" id="hks_forms" style="background:#9e1f1f;width:130px;font-size:0.9em;cursor:default">Цена покупки ключа<br><input id="key_price_orignal" type="text" size="14" placeholder="число" value="' + temp_kPrice + '"></div>');
    		$('#buttons center').append('<div class="btn" id="hks_forms" style="background:#9e1f1f;width:130px;font-size:0.9em;cursor:default">Сколько строк?<br><input id="calc_deals" type="text" size="14" placeholder="Позиций" value="' + deals_left + '"></div>');
    if ($("th.sorting:nth-child(3)").html() != 'Надо') {
      	  console.log("Тип авторизации: Стандартный");
      	  var account = 0;
        	$('#buttons center').append('<div class="btn" id="hks_forms" style="background:#9e1f1f;width:130px;font-size:0.9em;cursor:default">Число аккаунтов<br><input id="total_accs" type="text" size="14" placeholder="Число аккаунтов" value="' + temp_accs + '"></div>');
      	  $("th.sorting:nth-child(2)").after('<th title="Количество ключей для фермы" style="width: 0px;font-size:0.1em" class="sorting" tabindex="0" aria-controls="DataTables_Table_0" rowspan="1" colspan="1" aria-label="Надо: activate to sort column ascending">Надо</th>');
      	  for (i = 1; i < deals_left; i++) {
        	    $('tbody > tr:nth-child(' + i + ') > td:nth-child(2)').after('<td><center><b></b></center></td>');
     	   }
    } else {
     	   console.log("Тип авторизации: Через FLH");
     	   var account = 1;
     	   $('#buttons center').append('<div class="btn" id="hks_forms" style="background:#9e1f1f;width:130px;font-size:0.9em;;cursor:default"><b>Вход произведен</b><br>через FLH</div>');
    }
    
    	$('#tables').before('<span style="font-size:0.8em;left:17%;color:white;position:absolute;z-index:9999;top:3px">[ tweaked by <a href="https://t.me/ArcherDante" style="color:cyan">@ArcherDante</a> ]</span>');
    	$('#top').remove();
    	$('#DataTables_Table_0_filter').remove();
    	$('body').css('background-color','#272727');
    	$('thead').css('background-color','#202020');
    	$('thead').css('color','#fff');
    	$('#DataTables_Table_0').width(1250);
    	$('#DataTables_Table_1').width(1250);
    	$('#DataTables_Table_2').width(1250);
    	var nice_width = 200;
    	$('th.sorting_asc').width(nice_width - 75);
    	$('th.sorting:nth-child(5)').width(nice_width - 75);
    	$('th.sorting:nth-child(6)').width(nice_width - 75);
    	$('th.sorting:nth-child(7)').width(nice_width + 150);
    	$('th.sorting:nth-child(8)').width(nice_width + 150);
    	$('th.sorting:nth-child(9)').width(nice_width + 100);
    	$('th.sorting:nth-child(10)').width(nice_width + 100);


$("#hks").hover(
  function() {
    $(this).css("background-color","#c62828");
  }, function() {
    $(this).css("background-color","#9e1f1f");
  }
);


$('#hks').click(function() {

      		var 	sell_key_price = $('#sell_key_price').val(),
           			std_key_price = $('#key_price_orignal').val(),
           			part_of_cake = 87,
           			sets_rate = $('#sets_rate').val(),
           			calc_deals = $('#calc_deals').val(),
           			steam_to_qiwi = Math.round(sell_key_price / std_key_price * 100);


           		var interval = setInterval(calculate, 100);
 		       var i = 0;

       		 function calculate() {
       		 i++;     
            			if (account == 0) {
            			    var bot = $('#total_accs').val();
            			} else {
            			    var bot = $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ') > td:nth-child(3) b center').html();
            			}
           			//alert ($('#DataTables_Table_0 tbody > tr:nth-child(' + i + ') > td:nth-child(7)').html());
          			var 	price = $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ') > td:nth-child(4) a').html(),
            				cost = (bot * price).toFixed(2),
            				title = $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ') > td:nth-child(7)').attr('title'),
            				worst_text = 'Худший прогноз: ',
            				worst_pos1 = title.indexOf(worst_text) + worst_text.length,
            				worst_pos2 = title.indexOf(' ', worst_pos1) - worst_pos1,
            				worst_val = Number(title.substr(worst_pos1, worst_pos2)),
            				spread_text = 'Разброс цен: ',
            				spread_pos1 = title.indexOf(spread_text) + spread_text.length,
            				spread_pos2 = title.indexOf(' ', spread_pos1) - spread_pos1,
            				spread_val = Number(title.substr(spread_pos1, spread_pos2)),
            				set_text = 'Цена сета: ',
            				set_pos1 = title.indexOf(set_text) + set_text.length,
            				set_pos2 = title.length,
            				set_val = Number(title.substr(set_pos1, set_pos2));
          					 if (worst_val > 99999) {
          					     worst_val = 0
          					 }
          					 if (set_val > 99999) {
          					     set_val = 0
          					 }
          					 var set_size = $('tbody:not(:nth-child(1)) > tr:nth-child(' + i + ') > td:nth-child(1) a').html(),
          					     min_money_from_MARKET = ((Math.ceil(set_size / 2) * bot * (set_val / set_size)) / 100 * part_of_cake / 100 * steam_to_qiwi - cost).toFixed(2),
          					     set_value_for_qiwi_MARKET = (set_val / 100 * part_of_cake / 100 * steam_to_qiwi).toFixed(2),
          					     min_money_from_SETSELL = (Math.ceil(set_size / 2) * bot / set_size / sets_rate * sell_key_price - cost).toFixed(2),
          					     set_value_for_qiwi_SETSELL = (sell_key_price / sets_rate).toFixed(2);

          			if (Number(min_money_from_MARKET) <= 0 & Number(min_money_from_SETSELL) <= 0) {
			    $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ')').css('background-color','#fdd');
            			} else if (Number(min_money_from_MARKET) <= 0 || Number(min_money_from_SETSELL) <= 0) {
            			    $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ')').css('background-color','#fec');
            			} else {
            			    $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ')').css('background-color','#fff');
            			} 

            			$('#DataTables_Table_0 tbody > tr:nth-child(' + i + ') > td:nth-child(6)').html("<center>" + cost + " р.</center>");
            			if (Number(set_value_for_qiwi_MARKET) > Number(set_value_for_qiwi_SETSELL)) {
            			    $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ') > td:nth-child(7)').html("<center><span style='color:#000'><b>" + set_value_for_qiwi_MARKET + " р.</b></			span></center>");
            			    $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ') > td:nth-child(8)').html("<center><span style='color:#bbb'>" + set_value_for_qiwi_SETSELL + " р.</span></			center>");
            			} else {
            			    $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ') > td:nth-child(7)').html("<center><span style='color:#bbb'>" + set_value_for_qiwi_MARKET + "  р.</span></			center>");
            			    $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ') > td:nth-child(8)').html("<center><span style='color:#000'><b>" + set_value_for_qiwi_SETSELL + " р.</b></			span></center>");
            			}
            			if (Number(min_money_from_MARKET) > Number(min_money_from_SETSELL)) {
            			    $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ') > td:nth-child(9)').html("<center><b>" + min_money_from_MARKET + " р.</b></center>");
            			    $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ') > td:nth-child(10)').html("<center><span style='color:#bbb'>" + min_money_from_SETSELL + " р.</span></			center>");
            			} else {
            			    $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ') > td:nth-child(9)').html("<center><span style='color:#bbb'>" + min_money_from_MARKET + " р.</span></			center>");
            			    $('#DataTables_Table_0 tbody > tr:nth-child(' + i + ') > td:nth-child(10)').html("<center><b>" + min_money_from_SETSELL + " р.</b></center>");
            			}


            		if (i >= calc_deals) clearInterval(interval);
            		} // конец цикла
        $('#DataTables_Table_0 th.sorting_asc').html('Shop #1');
        $('#DataTables_Table_0 th.sorting:nth-child(5)').html('Shop #2');
        $('#DataTables_Table_0 th.sorting:nth-child(6)').html('Расходы<br><i>(на всех)</i>');
        $('#DataTables_Table_0 th.sorting:nth-child(7)').html('Цена сета<br>через Market');
        $('#DataTables_Table_0 th.sorting:nth-child(8)').html('Цена сета<br>через Trade');
        $('#DataTables_Table_0 th.sorting:nth-child(9)').html('Прибыль<br>через Market');
        $('#DataTables_Table_0 th.sorting:nth-child(10)').html('Прибыль<br>через Trade');
    });
//}