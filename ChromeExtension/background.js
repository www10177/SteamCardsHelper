function cardPriceCalculator(request,sender,callback) {
    // request = {"appid"}
    // callback will return {'appid','prices'}
    appid=request.appid
    console.log(appid);

    var URL =  'https://steamcommunity.com/market/search?category_753_Game%5B%5D=tag_app_'+appid.toString()+'&category_753_cardborder%5B%5D=tag_cardborder_0&category_753_item_class%5B%5D=tag_item_class_2&appid=753'
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange=function(){

        if( xhr.readyState==4  ){
            parser = new DOMParser();
            var doc = parser.parseFromString(xhr.responseText,"text/html")
            var price_nodes = doc.querySelectorAll("span.normal_price[data-price]");
            var prices=[];
            for (var i=0;i<price_nodes.length;i++){
                prices.push(price_nodes[i].innerHTML);
            }

            callback({'appid':appid,'prices':prices});
        }
    };
    xhr.open("GET",URL,false);
    xhr.send();
}


chrome.runtime.onMessage.addListener(cardPriceCalculator);