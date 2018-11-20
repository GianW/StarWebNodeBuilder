"use strict";
require('dotenv').config()
const exec = require('child_process').exec;
const fs = require('fs');

let compile = require('./compile.js');

let nomeArquivo = process.argv[3];
let arquivoOrigem = process.argv[2];
let arquivoDestino;
let build = process.argv[4];
let url;
let dirRemoto;
let arquivoSemExt = nomeArquivo.substring(0, nomeArquivo.lastIndexOf("."));
let extensaoArq = nomeArquivo.substring(nomeArquivo.lastIndexOf("."), nomeArquivo.length);

if (build.substr(-4) == 'senv') {
   arquivoDestino = process.env.DIR_TKE_DEV + "\\" + nomeArquivo;
   url = process.env.LINK_WEB_DEV + `${build}.pl/progs/swfw0080`;
   dirRemoto = `d:/sisweb/desenv/ait/${nomeArquivo}`;
}else{
   console.log("Ambiente de PROD");
   arquivoDestino = process.env.DIR_TKE_PROD + "\\" + nomeArquivo;
   url = process.env.LINK_WEB_PROD + `${build}.pl/progs/swfw0080`;
   dirRemoto = `d:/sisweb/prod/ait/${nomeArquivo}`;
}


/**/
geraBkp()
   .then(copiaArquivo(arquivoOrigem, arquivoDestino))
   .then(compile.compilaPrograma(url, dirRemoto))
   .catch(console.error);



function copiaArquivo(origem, destino){
   console.log("Copiando arquivo para ambiente de destino...");
   /*Se arquivo não está no diretorio do sistema de dev, transporte para produção deve ser feito via sistema*/
   if (origem != destino && build.substr(-4) == 'senv') {
      console.log("Transportando arquivo...");
      if (process.platform == "win32" || process.platform == "win64") {
         exec('COPY "' + origem + '" "' + destino + '" ');
         return Promise.resolve('done');
      }else{
         exec("cp -p '" + origem + "' '" + destino + "'");
         return Promise.resolve('done');
      }
   }else{
      return Promise.resolve('done');
   }
   console.log(destino);
}


function geraBkp(){
   console.log("Gerando arquivo de backup...");
   if (process.env.DIR_BKP) {
      let dirBkp = process.env.DIR_BKP + "/" + arquivoSemExt;
      criaDirBkp(dirBkp)
         .then(criaArqBkp(dirBkp))
         .catch(console.error);
      return Promise.resolve('done');
   }else{
      return Promise.resolve('done');
   }
}

/*Caso não exista cria diretório do programa*/
function criaDirBkp(path){
   if (fs.existsSync(path)) {
      return Promise.resolve('done');
   }else{
      fs.mkdirSync(path);
      return Promise.resolve('done');
   }
}

function criaArqBkp(path){
   let data = new Date();
   let nomeNovoArquivo = path + "/" + arquivoSemExt + "_" + data.getDate() + "_" + (data.getMonth() + 1) + "_" + data.getYear() + "_" + data.getHours() + "_" + data.getMinutes() + extensaoArq;

   fs.createReadStream(arquivoDestino).pipe(fs.createWriteStream(nomeNovoArquivo));
   return Promise.resolve('done');

}