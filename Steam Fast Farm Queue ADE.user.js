// ==UserScript==
// @name         Steam Fast Farm Card
// @namespace    https://github.com/Kasp42/SteamSummer2016
// @version      1.2
// @description  Fast Farm Card From Steam Summer 2016
// @author       Kasper (Telegram: https://telegram.me/kasp42)
// @match        http://store.steampowered.com/explore*
// @grant        none
// ==/UserScript==

var NOQ = 5;

(function() {
    $J('.discovery_queue_apps h2').append('<span style="margin-left: 10px;" class="btnv6_lightblue_blue btn_medium" id="AutoFarmCard"><span>Get Cards</span></span>');
	$J('#AutoFarmCard').on('click',function(){
		ViewList(0);
		$J('#AutoFarmCard span').text('Wait(0/3)...');
	});
})();

var ViewList = function(queueNumber){
	$J('#AutoFarmCard span').text('Wait('+(++queueNumber)+'/3)...');
    jQuery.post('http://store.steampowered.com/explore/generatenewdiscoveryqueue', {sessionid: g_sessionID, queuetype: 0}).done(function(data){
        var requests = [];
        for(var i = 0; i < data.queue.length; i++)
            requests.push( jQuery.post( 'http://store.steampowered.com/app/'+data.queue[i], { appid_to_clear_from_queue: data.queue[i], sessionid: g_sessionID } ) );
        jQuery.when.apply(jQuery, requests).done(function(){
            if(queueNumber < NOQ) ViewList(queueNumber);
            else {
            	$J('#AutoFarmCard span').text('Done!');
            	setTimeout(function(){window.location.reload();},1500);
            }
        }).fail(function(){ViewList(queueNumber)});
    }).fail(function(){ViewList(queueNumber)});;
};
