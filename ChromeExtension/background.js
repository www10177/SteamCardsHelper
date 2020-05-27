function parseJSON(json){
    //parse JSON data from steam market API
            console.log(json)
            let results = json['results'];
            let  total_count = json.total_count;
            let prices=[];
            let qtys=[];
            let names=[];
            let currency_text ='';
            for (let i = 0 ; i<results.length;i++){
                prices.push(results[i]['sell_price']/100);
                qtys.push(results[i]['sell_listings']);
                names.push(results[i]['hash_name']);
                currency_text = results[i]["sale_price_text"];
            }
            return {'total_count':total_count,'prices':prices,'qtys':qtys,'currency_text':currency_text,'names':names};
    }
function getJSON(response){
    // Get JSON from reponse and check if response is OK
    console.log(response.url)
    if( response.ok  ){   
        return response.json();
    }
}

function cardPriceCalculator(request,sender,callback) {
    // request = {"appid"}
    appid=request.appid
    console.log(appid);

    //let URL =  'https://steamcommunity.com/market/search?category_753_Game%5B%5D=tag_app_'+appid.toString()+'&category_753_cardborder%5B%5D=tag_cardborder_0&category_753_item_class%5B%5D=tag_item_class_2&appid=753'
    let URL = 'https://steamcommunity.com/market/search/render/?query=&start=0&count=30&norender=1&search_descriptions=0&sort_column=popular&sort_dir=desc&appid=753&category_753_Game%5B%5D=tag_app_'+appid.toString()+'&category_753_cardborder%5B%5D=tag_cardborder_0&category_753_item_class%5B%5D=tag_item_class_2'
    fetch(URL,{method:'GET'})
    .then(getJSON)
    .then(parseJSON)
    .then(res =>callback(res))
    .catch(function(e){
        console.log(e.message);
        callback({'total_count':-1,'prices':[],'qtys':[],'currency':-2});

    });
    return true;
}


chrome.runtime.onMessage.addListener(cardPriceCalculator);
