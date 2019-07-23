var request = require('request');
var cheerio = require('cheerio');

exports.compilaPrograma = function (url, arquivo) {
   request.post({url: url, "rejectUnauthorized": false,  form :{'Arquivo' : arquivo}}, function (err, httpResponse, body) {
       if (!err && httpResponse.statusCode == 200) {
           var $ = cheerio.load(body,  {decodeEntities: true});
           $('.tdComp').each(function(i, elem) {
              console.log($(this).html());
            });
           $('.td2').each(function(i, elem) {
            console.log( $(this).children("img").attr('alt'));
           });
       }
   });
}