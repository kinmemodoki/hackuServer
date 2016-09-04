var express = require('express');
var request = require('superagent');
var zahyo = require('../bin/getLatLng.js');
var router = express.Router();

var json = {
    errorCode:0,
    data:{
        name:"食神 餃子王",
        address:"〒182-0026 東京都調布市小島町1-5-1",
        url:"http://r.gnavi.co.jp/dw0pykma0000/?ak=EbE9h4iD4t8%2F7JyV1oJRuzhuPIXl67km3TCJ2iVsRdQ%3D",
        latitude:"35.652414",
        longitude:"139.545242"
    }
}

function getJson(lat,lng,dis,azi,callback){
  var latlng = zahyo.compute(lat,lng,dis,azi);
  var tergetLat = latlng[0];
  var tergetLng = latlng[1];
  request
    .get("http://api.gnavi.co.jp/RestSearchAPI/20150630")
    .query({
      keyid:"ce847a4f79dbaa44271020a33d3f8f06",
      format:"json",
      latitude:tergetLat,
      longitude:tergetLng,
      range:2
    })
    .end(function(err, gnavi){
      //gnavi = JSON.parse(gnavi);
      //console.log(gnavi.text);
      if(err||gnavi.text.total_hit_count=="0"){
        if(dis>600&&gnavi.text.total_hit_count=="0"){
          //もっと近くを検索
          getJson(lat,lng,dis+-300,azi,callback);
        }else{
          return {errorCode:1,data:{}};
        }
      }else{
        console.log();
        callback(err,JSON.parse(gnavi.text));
      }
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var lat = req.query.latitude||35.652414;
  var lng = req.query.longitude||139.545242;
  var dis = req.query.distance||0;
  var azi = req.query.azimuth||0;
  
  getJson(lat,lng,dis,azi,function(err,gnavi){
    var json = {
      errorCode:0,
      data:{
        name:gnavi.rest[0].name,
        address:gnavi.rest[0].address,
        url:gnavi.rest[0].url,
        latitude:gnavi.rest[0].latitude,
        longitude:gnavi.rest[0].longitude
      }
    };
    res.send(json);
  });
});

/*
router.get('/now', function(req, res, next) {
  res.render('index.jade',{
    title: 'ChatRoooom'
  });
});
*/
module.exports = router;

//thesis（目標規定文）
//自動で飯屋を決められないから自動で決めてほしい．でも全部自動は嫌．
//いったことある店だけ検索するモード