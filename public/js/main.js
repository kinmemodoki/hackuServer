var shakeFlag_x = 0;
var shakeCount = 0;
var direction = 0;
var category = "";
var lat = 0;
var lng = 0;

document.oncontextmenu = function(){return false;};


/***************座標・方角関連*******************/
function geoSuccess(position) {
  lat = position.coords.latitude;
  lng = position.coords.longitude;
  console.log(lat,lng);
  alert(lat);
  document.getElementById("sensor").addEventListener('touchstart', function(event) {
	  document.getElementById("massage").innerText = "Shake!!";
	  $("#hand").addClass("vi");
	  //ホールドしたらシェイクを検知する．
    window.addEventListener('devicemotion', shake, false);
  });
}

navigator.geolocation.getCurrentPosition(geoSuccess);

window.addEventListener('deviceorientation', function(event){ //デバイスの傾きや方角の値が変化したときに発火
	direction = event.alpha;  // event.alphaで方角の値を取得
});

/***************振る関連*******************/
function shake(event){ //デバイスが動いたときに発火
	console.log("knock!");
  var acceleration_x = event.acceleration.x;//左右の動き
  if (acceleration_x > 15 && shakeFlag_x != 1) { //シェイクしたときに実行
    shakeFlag_x = 1;
    shakeCount++;
    console.log("shake!! at ", acceleration_x, shakeCount);
  } else if (acceleration_x < -15 && shakeFlag_x != 0) { //シェイクして戻ったときの処理
    shakeFlag_x = 0
  }
  if(shakeCount > 5){
  	document.getElementById("massage").innerHTML = "Point &<br>Release Screen";
  	$("#hand").attr({"src": "./img/point.png"});
  	$("#hand").removeClass("vi");
  	document.getElementById("sensor").addEventListener('touchend', function(event) {
  		location.href = "./result?lat="+lat+"&lng="+lng+"&category="+category+"&direction="+direction+"&shakeCount="+shakeCount;
		});
  }
}
document.getElementById("sensor").addEventListener('touchend', function(event) {
	document.getElementById("massage").innerText = "Hold Screen";
	$("#hand").removeClass("vi");
  window.removeEventListener('devicemotion', shake, false);
});

/***************モジュール関連*******************/
document.getElementById("sushi").addEventListener('touchstart', function(event) {
	category = "寿司";
	document.getElementById("back").innerText = "鮨";
	$("body").css("background-color", "#0055d4");
	$("#back").css("color", "#003e9a");
});

document.getElementById("sake").addEventListener('touchstart', function(event) {
	category = "居酒屋";
	document.getElementById("back").innerText = "酒";
	$("body").css("background-color", "#fcc900");
	$("#back").css("color", "#c9a000");
});

document.getElementById("men").addEventListener('touchstart', function(event) {
	category = "ラーメン";
	document.getElementById("back").innerText = "麺";
	$("body").css("background-color", "#d40000");
	$("#back").css("color", "#b90000");
});

document.getElementById("all").addEventListener('touchstart', function(event) {
	category = "";
	document.getElementById("back").innerText = "全";
	$("body").css("background-color", "#a0a0a0");
	$("#back").css("color", "#666");
});

document.getElementById("howto").addEventListener('touchstart', function(event) {
	alart("まだできてないよ");
});
