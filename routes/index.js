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
var errorJson = {errorCode:1,data:{}};

function getJson(lat,lng,dis,azi,cate,callback){
  var latlng = zahyo.compute(lat,lng,dis,azi);
  var tergetLat = latlng[0];
  var tergetLng = latlng[1];
  request
    .get("http://api.gnavi.co.jp/RestSearchAPI/20150630")
    .query({
      keyid:"",
      format:"json",
      latitude:tergetLat,
      longitude:tergetLng,
      freeword:cate,
      range:2,
      hit_per_page:1
    })
    .end(function(err, gnavi){
      //gnavi = JSON.parse(gnavi);
      //console.log(typeof gnavi.text);
      var tmp = JSON.parse(gnavi.text);
      console.log(tmp);
      if(err||tmp.error){
        console.log("error");
        if(dis>600&&tmp.error||0){
          //もっと近くを検索
          getJson(lat,lng,dis+-500,azi,cate,callback);
        }else{
          callback(errorJson,tmp);
        }
      }else{
        console.log(typeof tmp);
        callback(err,tmp);
      }
    });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  var lat = req.query.latitude||35.652414;
  var lng = req.query.longitude||139.545242;
  var dis = req.query.distance||0;
  var azi = req.query.azimuth||0;
  var cate = req.query.category;
  
  
  
  getJson(lat,lng,dis,azi,cate,function(err,gnavi){
    if(err){
      res.send(errorJson);
    }else{
      var json = {
        errorCode:0,
        data:{
          name:gnavi.rest.name,
          address:gnavi.rest.address,
          url:gnavi.rest.url,
          latitude:gnavi.rest.latitude,
          longitude:gnavi.rest.longitude,
          image:gnavi.rest.image_url.shop_image1
        }
      };
      res.send(json);
    }
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
