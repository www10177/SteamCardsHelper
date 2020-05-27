"use strict";
function GetAppIDFromUrl( url )
{
    const appid = url.match( /\/app\/([0-9]{1,7})/);
    return appid ? parseInt(appid[1],10) : -1;
}

function click_cal_price(appid ){
chrome.runtime.sendMessage({'appid':appid},function(response){
    console.log(response);
    let URL =  'https://steamcommunity.com/market/search?category_753_Game%5B%5D=tag_app_'+appid.toString()+'&category_753_cardborder%5B%5D=tag_cardborder_0&category_753_item_class%5B%5D=tag_item_class_2&appid=753'
    window.open(URL);

});
}

function storeButtonInject() {
	//Get APPID
    let url = window.location.href;
    console.log('Mine');
    console.log(url);
    let appid=GetAppIDFromUrl(url);
    console.log(appid);

    //Add Appid Button in queue
    let queue = document.getElementsByClassName('queue_actions_ctn')[0];
    let outer_div = document.createElement('div');
    let inner_div = document.createElement('div');
    outer_div.append(inner_div);
    queue.append(outer_div);

    inner_div.classList.add(...["btnv6_blue_hoverfade", "btn_medium", "queue_btn_inactive"]);
    inner_div.style='';
    inner_div.innerHTML = '<span>'+'計算卡包獲利'+'<\/span>';
    outer_div.classList.add('queue_control_button');
    outer_div.id = 'cal_booster_card_div'

    console.log(queue);
    outer_div.addEventListener('click',function() {click_cal_price(appid);});
};

document.addEventListener("DOMContentLoaded",storeButtonInject());