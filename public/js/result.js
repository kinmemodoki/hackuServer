var URL = "https://gnavi-rest-kinmemodoki.c9users.io/";

function render(res){
    console.log(res);
    document.getElementById("massage").innerText = res.data.name;
    document.getElementById("address").innerText = res.data.address;
    document.getElementById("url").innerText = res.data.url;
}

function getData(lat,lng,distance,azimuth,category){
    $.ajax({
        type: 'GET',
        url: URL,
        data: {
            latitude:lat,
            longitude:lng,
            distance:distance,
            azimuth:azimuth,
            category:category
        },
        dataType: 'json',
        success: function(response){
            //return response;
            render(response);
        },
    	error: function(response){
            alart("server error!!");
        }
    });
}

function shake2dis(count){
    return 300 + count * 50;
}

window.onload = function(){
    var query = getUrlVars();
    console.log(query);
    getData(query.lat,query.lng,shake2dis(query.shakeCount),query.direction,decodeURI(query.category));
}

function getUrlVars()
{
    var vars = [], max = 0, hash = "", array = "";
    var url = window.location.search;

    //?を取り除くため、1から始める。複数のクエリ文字列に対応するため、&で区切る
    hash  = url.slice(1).split('&');    
    max = hash.length;
    for (var i = 0; i < max; i++) {
        array = hash[i].split('=');    //keyと値に分割。
        vars.push(array[0]);    //末尾にクエリ文字列のkeyを挿入。
        vars[array[0]] = array[1];    //先ほど確保したkeyに、値を代入。
    }

    return vars;
}
