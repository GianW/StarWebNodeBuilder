"use strict";
require('dotenv').config()
const exec = require('child_process').exec;

let compile = require('./compile.js');

let nomeArquivo = process.argv[3];
let arquivoOrigem = process.argv[2];
let arquivoDestino;
let build = process.argv[4];
let url;
let dirRemoto;


if (build.substr(-4) == 'senv') {
   arquivoDestino = process.env.DIR_TKE_DEV + "\\" + nomeArquivo;
   url = process.env.LINK_WEB_DEV + `${build}.pl/progs/swfw0080`;
   dirRemoto = `d:/sisweb/desenv/ait/${nomeArquivo}`;
}else{
   arquivoDestino = process.env.DIR_TKE_PROD + "\\" + nomeArquivo;
   url = process.env.LINK_WEB_PROD + `${build}.pl/progs/swfw0080`;
   dirRemoto = `d:/sisweb/prod/ait/${nomeArquivo}`;
}

copiaArquivo(arquivoOrigem, arquivoDestino)
   .then(compile.compilaPrograma(url, dirRemoto))
   .catch(console.error);

function copiaArquivo(origem, destino){
   if (origem != destino) {
      exec("cp -p '" + origem + "' '" + destino + "'");
   }
   console.log(destino);
   return Promise.resolve('done');
}
