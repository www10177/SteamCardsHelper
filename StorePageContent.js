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
    //Create DIV to show cards info
    if (document.getElementById('cards_info')){
        document.getElementById('cards_info').remove();
    }
    let node = document.createElement('div');
    node.setAttribute('id','cards_info');


    //Append text into div
    let append_newline = function (node,text) {
        node.appendChild(document.createTextNode(text));
        node.appendChild(document.createElement("br"));
        return node;
    }
    if (response['total_count '] == -1){
        node = append_newline(node,"出錯了，網路可能異常或者是有隻Bug躲在code裡");
    }
    else if (response['total_count'] == 0){
        node = append_newline(node,"本頁面所對應的appid查無卡片");
        node = append_newline(node,"可能是不會掉落卡片、市集上並無人販售卡片、目前頁面非遊戲本體頁面");
    }
    else{
        const amount = response['total_count'];
        let text = "卡片數量："+amount ;
        node = append_newline(node,text);

        let gem_cost_dict = {15:400,13:462,12:500, 11:545,10:600,9:667, 8:750,7:857,6:1000,5:1200};
        let gem_cost = amount in gem_cost_dict ? gem_cost_dict[amount] : 0;
        text = "所需寶珠數量："+gem_cost;
        node = append_newline(node,text);
        
        let gem_price = response['gem_price'];
        text = "一袋寶珠(1000顆)價格："+gem_price;
        node = append_newline(node,text);

        let avg_prices = 0.85*(response['prices']).reduce((a,b)=> a+b)/amount; 
        text = "平均單卡最低售價（已扣15%手續費）："+avg_prices.toFixed(2);
        node = append_newline(node,text);

        let avg_qtys= (response['qtys']).reduce((a,b)=> a+b)/amount; 
        text = "平均卡片上架數量："+avg_qtys.toFixed(1);
        node = append_newline(node,text);

        let cost = gem_price / 1000 * gem_cost;
        text = '卡包所需寶珠成本：'+ cost.toFixed(2);
        node = append_newline(node,text);

        let profit = avg_prices *3 -cost;
        text = '合卡包獲利：'+profit.toFixed(2);
        node = append_newline(node,text);
        
        let market_link = document.createElement('a');
        market_link.innerHTML = '開啟市場頁面';
        market_link.setAttribute('href',URL);
        market_link.setAttribute('target','_blank');
        node.appendChild(market_link);
    }
    let queue_div =document.getElementsByClassName('queue_actions_ctn')[0];
    queue_div.appendChild(node);

    //window.open(URL);

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
    inner_div.innerHTML = '<span>'+'計算合卡包獲利'+'<\/span>';
    outer_div.classList.add('queue_control_button');
    outer_div.id = 'cal_card_div'
    console.log(queue);
    outer_div.addEventListener('click',function() {click_cal_price(appid);});
};

document.addEventListener("DOMContentLoaded",storeButtonInject());