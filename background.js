function parseCardJson(json){
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
function getJson(response){
    // Get JSON from reponse and check if response is OK
    console.log(response.url)
    if( response.ok  ){   
        return response.json();
    }
}

function parseGemJson(json){
    let gem_price = parseInt(json['lowest_sell_order'],10)/100;
    return {'gem_price':gem_price};
}

function cardPriceCalculator(request,sender,callback) {
    // request = {"appid"}
    let appid=request.appid
    console.log(appid);

    //let URL =  'https://steamcommunity.com/market/search?category_753_Game%5B%5D=tag_app_'+appid.toString()+'&category_753_cardborder%5B%5D=tag_cardborder_0&category_753_item_class%5B%5D=tag_item_class_2&appid=753'
    const gem_url ='https://steamcommunity.com/market/itemordershistogram?country=TW&language=tchinese&currency=30&item_nameid=26463978'
    let URL = 'https://steamcommunity.com/market/search/render/?query=&start=0&count=30&norender=1&search_descriptions=0&sort_column=popular&sort_dir=desc&appid=753&category_753_Game%5B%5D=tag_app_'+appid.toString()+'&category_753_cardborder%5B%5D=tag_cardborder_0&category_753_item_class%5B%5D=tag_item_class_2'
    const card_fetch= fetch(URL,{method:'GET'})
    .then(getJson)
    .then(parseCardJson)
    .catch(function(e){
        console.log(e.message);
        return {'total_count':-1,'prices':[],'qtys':[],'currency_text':'','names':[]};
    });
    
    const gem_fetch =fetch(gem_url, {method:'GET'})
    .then(getJson)
    .then(parseGemJson)
    .catch(function(e){
        console.log(e.message);
        return {'gem_price':-1};
    });
    Promise.all([card_fetch,gem_fetch])
    .then(function (results){
        let result = results[0];
        console.log(results[1]);
        result['gem_price'] = results[1]['gem_price'];
        console.log(result);
        callback(result);
    })
    .catch(function(e){
        console.log(e.message);
        return {'total_count':-1,'prices':[],'qtys':[],'currency_text':'','names':[],'gem_price':-1};
    });
    return true;
    
}

~function listener(){
chrome.runtime.onMessage.addListener(cardPriceCalculator);
}();
