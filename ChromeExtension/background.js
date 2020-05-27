function parseMarketHTML(html){
            var doc = parser.parseFromString(html,"text/html")
            var prices_nodes = doc.querySelectorAll("span.normal_price[data-price]");
            var qty_nodes = doc.querySelectorAll("span.market_listing_num_listings_qty");
            if ((prices_nodes.length != qty_nodes.length ) || (prices_nodes.length === 0) || (qty_nodes.length ===0)){
                return {'total_count':0,'prices':[],'qtys':[],'currency':-1};
            }

            var prices=[];
            var qtys=[];
            prices_nodes.forEach(node=> prices.push(parseInt(node.getAttribute("data-price"))/100));
            qty_nodes.forEach(node=> qtys.push(parseInt(node.getAttribute('data-qty'))));
            var total_count = parseInt(doc.getElementById('searchResults_total').innerHTML);
            var currency = parseInt(prices_nodes[0].getAttribute('data-currency'));
            return {'total_count':total_count,'prices':prices,'qtys':qtys,'currency':currency};
    }
function getHTML(response){
    console.log(response.url)
    if( response.ok  ){
        parser = new DOMParser();
        return response.text();
    }
}

function cardPriceCalculator(request,sender,callback) {
    // request = {"appid"}
    // callback will return {'appid','prices'}
    appid=request.appid
    console.log(appid);

    let URL =  'https://steamcommunity.com/market/search?category_753_Game%5B%5D=tag_app_'+appid.toString()+'&category_753_cardborder%5B%5D=tag_cardborder_0&category_753_item_class%5B%5D=tag_item_class_2&appid=753'
    fetch(URL+"#p1_price_desc",{method:'GET'})
    .then(getHTML)
    .then(function(html){
        let result = parseMarketHTML(html)
        console.log()
        if (result['total_count'] >10 && result['total_count'] <=20 ){
            fetch(URL+"#p2_price_desc",{method:'GET'})
            .then(getHTML)
            .then(parseMarketHTML)
            .then(function(p2result){
                console.log(p2result);
                console.log(result);
                result['prices'] = result['prices'].concat(p2result['prices']);
                result['qtys'] = result['qtys'].concat(p2result['qtys']);
                console.log(result);
            })
        }
        else if (result.total_count >20){
            result = {'total_count':0,'prices':[],'qtys':[],'currency':-1};
        }
        return result;
        })
    .then(function(res){
        callback(res);
    });
    return true;
}


chrome.runtime.onMessage.addListener(cardPriceCalculator);
