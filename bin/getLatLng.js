function VincentyDirect(ellipse, lat, lng, azimuth1, distance, imax) {

    var a = ellipse.a, b = ellipse.b, f = ellipse.f;

    var lat1 = lat, lng1 = lng;
    var az1 = azimuth1;
    var s = distance;
    var sinAz1 = Math.sin(az1), cosAz1 = Math.cos(az1);

    var U1 = Math.atan((1 - f) * Math.tan(lat1 * Math.PI / 180.0));
    var sigma1 = Math.atan2((1 - f) * Math.tan(lat1 * Math.PI / 180.0), cosAz1);

    var sinU1 = Math.sin(U1), cosU1 = Math.cos(U1);
    var sinAlfa = cosU1 * sinAz1;
    var cosAlfa2 = 1 - Math.pow(sinAlfa, 2);

    var uu = cosAlfa2 * (a * a - b * b) / (b * b);
    var A = 1 + (uu / 16384.0) * (4096 + uu * (-768 + uu * (320 - 175 * uu)));
    var B = (uu / 1024.0) * (256 + uu * (-128 + uu * (74 - 47 * uu)));

    var sigma = s / (b * A);
    var sigma0;
    var sinSigma, cosSigma, cos2Sigmam;
    var dSigma;

    for (var i = 0; i < imax; i++) {
        cos2Sigmam = Math.cos(2 * sigma1 + sigma);
        sinSigma = Math.sin(sigma);
        cosSigma = Math.cos(sigma);
        dSigma = B * sinSigma * (cos2Sigmam + (B / 4.0) * (cosSigma * (-1 + 2 * Math.pow(cos2Sigmam, 2))
                    - (B / 6.0) * cos2Sigmam * (-3 + 4 * Math.pow(sinSigma, 2)) * (-3 + 4 * Math.pow(cos2Sigmam, 2))));
        sigma0 = sigma;
        sigma = s / (b * A) + dSigma;

        if (Math.abs(sigma - sigma0) <= 1.0e-12) break;

    }
    cos2Sigmam = Math.cos(2 * sigma1 + sigma);
    sinSigma = Math.sin(sigma);
    cosSigma = Math.cos(sigma);
    var phi2 = Math.atan2(sinU1 * cosSigma + cosU1 * sinSigma * cosAz1,
                (1 - f) * Math.sqrt(sinAlfa * sinAlfa + Math.pow(sinU1 * sinSigma - cosU1 * cosSigma * cosAz1, 2)));
    var lamuda = Math.atan2(sinSigma * sinAz1, cosU1 * cosSigma - sinU1 * sinSigma * cosAz1);
    var C = (f / 16.0) * cosAlfa2 * (4 + f * (4 - 3 * cosAlfa2));

    var omega = lamuda - (1 - C) * f * sinAlfa * (sigma + C * sinSigma * (cos2Sigmam + C * cosSigma * (-1 + 2 * Math.pow(cos2Sigmam, 2))));
    var lamuda2 = lng1 * Math.PI / 180.0 + omega;
    var az2 = Math.atan2(sinAlfa, -sinU1 * sinSigma + cosU1 * cosSigma * cosAz1) + Math.PI;

    if (!isFinite(phi2) || !isFinite(lamuda2) || !isFinite(az2)) return 0;
    if (az2 < 0) az2 = az2 + Math.PI * 2.0;
    if (i >= imax) i = imax - 1;

    return {
        lat: (phi2 * 180 / Math.PI),
        lng: (lamuda2 * 180 / Math.PI),
        azimuth2: az2,
        itimes: i + 1
    };

};

function readAz1(d,m,s) {
    var az1 = 0;
    var degree = parseFloat(d, 10);
    if (isFinite(degree)) {
        az1 += degree % 360;
    }

    var minute = parseInt(m, 10);
    if (isFinite(minute)) {
        az1 += Math.floor(minute / 60); 
        az1 += (minute % 60) / 60.0;
    }

    var second = parseFloat(s);
    if (isFinite(second)) {
        az1 += Math.floor(second / 60) / 60.0;
        az1 += (second % 60) / 3600.0;
    }

    if (isFinite(az1)) {
        az1 = az1 * Math.PI / 180.0;
        return az1;
    } else {
        return NaN;
    }
}

function compute(lat, lng, dis, azi) {
    var Ellipse = {
        a: 6378137.0,
        b: 6356752.31414036,
        f: 1 / 298.257222101
    };
    var s = dis;
    if(!Array.isArray(azi)){
        azi = [azi,0,0]; 
    }

    var azimuth1 = readAz1(azi[0],azi[1],azi[2]);

    if (lat && isFinite(s) && isFinite(azimuth1)) {
        var result = VincentyDirect(Ellipse, lat, lng, azimuth1, s, 50);

        if (result) {
            var lat2 = result.lat;
            var lng2 = result.lng;
            console.log(lat2.toFixed(12),lng2.toFixed(12));
            return [lat2.toFixed(12),lng2.toFixed(12)];
        } else {
            console.log("no result");
            return;
        }
    } else {
        console.log("no result");
        return;
    }
}

module.exports.compute = compute;
