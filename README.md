#gnaviのやつ返す奴

##使い方(example)

URLは暫定

    https://gnavi-rest-kinmemodoki.c9users.io/
    ?
    latitude=35.652414&
    longitude=139.545242&
    distance=100&
    azimuth=90.000000&
    category="中華"
    

##レスポンス

    var json = {
        errorCode:0,
        data:{
            name:"食神 餃子王",
            address:"〒182-0026 東京都調布市小島町1-5-1",
            url:"http://r.gnavi.co.jp/dw0pykma0000/?ak=EbE9h4iD4t8%2F7JyV1oJRuzhuPIXl67km3TCJ2iVsRdQ%3D",
            latitude:"35.652414",
            longitude:"139.545242",
            image:
        }
    }
    
##仕様

クエリの*latitude*と*longitude*から*azimuth*の方位角に向かって*distance*(m)分先の座標を返す

検索範囲は300m. 見つからなかったら*distance-300*(m)距離で再検索