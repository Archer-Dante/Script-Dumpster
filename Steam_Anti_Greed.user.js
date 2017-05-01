// ==UserScript==
// @name           Steam Anti Greed
// @namespace      SAG
// @description    Unlocks Steam Bundles
// @include        /^http:\/\/store\.steampowered\.com/(app|bundle|sub)/
// @include_globs  /^http:\/\/store\.steampowered\.com/(app|bundle|sub)/
// @version        1.0.5
// @author         Archer-Dante
// @grant          none
// ==/UserScript==

break_it();

    function break_it() {
        if (typeof window.jQuery == 'undefined') {
            window.setTimeout(break_it, 100);
        } else {
            $ = window.jQuery.noConflict(false);
            (!!window.chrome && !!window.chrome.webstore) ?
            fix_it_chrome() : fix_it_firefox()
        }
    }

    function fix_it_firefox() {
      $('.btn_addtocart').removeClass('btn_addtocart');
      $('.game_purchase_discount').attr('style','display:inline-block');
        setTimeout(fix_it_firefox,100);
    }


    function fix_it_chrome() {
      $('.discount_block').removeClass('discount_block').css('display','');
        $('.game_area_purchase_game').each(function(){
        var wowID = $('form[name^=add_bundle] > input:last', this).attr('value');
        if (wowID == null) {
           void(0);
        }else {
           $('a[href^=javascript]',this)
               .removeClass('discount_block')
               .attr('href','javascript:addBundleToCart('+wowID+')')
               .attr('style','opacity:1;cursor:pointer;display:block');
              }
        });
    }