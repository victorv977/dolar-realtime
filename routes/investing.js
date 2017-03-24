var express = require('express');
var request = require('request');
var _ = require('underscore');
var router = express.Router();

/* GET brentOil listing from http://es.investing.com/commodities/brent-oil. */
router.get('/brentOil', function(req, res, next) {
    var options = {
      url: 'http://es.investing.com/common/modules/js_instrument_chart/api/data.php?symbol=Petr%25C3%25B3leo%2BBrent&pair_id=8833&pair_id_for_news=8833&chart_type=area&pair_interval=300&candle_count=120&events=yes&volume_series=yes',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0)',
        'Referer': 'http://es.investing.com/commodities/brent-oil',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };

    request(options, function(error, response, html) {
        if (!error) {
            var data = JSON.parse(html);

            // Sort the data to avoid http://www.highcharts.com/errors/15
            if(data.candles) {
                data.candles = _.sortBy(data.candles, function(arr) { return arr[0]; });
            }

            if(data.events && data.events.news) {
                data.events.news = _.sortBy(data.events.news, function(o) { return o.x; });
            }

            res.jsonp(data);
            // json.forEach(function (element, index, array) {
            //     element= JSON.parse(element)
            //     data.precio.push([element.t, parseFloat(element.p)]);
            //     data.monto.push([element.t, element.m]);
            // });
            // //console.log(json);
            // res.jsonp(data);
        } else {
            console.error("Error on request: " + url + "Error: " + error);
            res.status(500).send('The url <strong>' + options.url + '</strong> cannot be contacted, error: <br/> <strong>' + error + '</strong>');
        }
    });
});

module.exports = router;
