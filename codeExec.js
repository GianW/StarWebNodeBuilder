var request = require('request');
var cheerio = require('cheerio');
const fs = require('fs');
require('dotenv').config()

let url = process.env.LINK_EXEC;
let fileContent = fs.readFileSync(process.argv[2]).toString();
let j = request.jar();
let cookie = request.cookie('swfwIdDoUsuario=admin');

if(process.argv[3] == "prod"){
   url =  process.env.LINK_EXEC_PROD;
};

j.setCookie(cookie, url);

console.log("Executando:");
console.log(fileContent);
console.log("============================");
console.log("Resultado:");
console.log("============================");


// request.post({url: url, form :{acao: "executar", conteudoDoEditor: "for each gmd-causa no-lock: disp gmd-causa. end."}, jar: j}, function (err, httpResponse, body) {
request.post({url: url, form :{acao: "executar", conteudoDoEditor: fileContent}, jar: j}, function (err, httpResponse, body) {
    if (!err && httpResponse.statusCode == 200) {
      // console.log(body);
      var $ = cheerio.load(body,  {decodeEntities: true});

      if ($('.td1').length > 0) {
         $('.td1').each(function(i, elem) {
            console.log($(this).html());
         });
      }

      if ($('xmp').length > 0) {
         $('xmp').each(function(i, elem) {
            console.log($(this).html());
         });
      }


   }
})