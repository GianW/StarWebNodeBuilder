var request = require('request');
var fs = require('fs');
require('dotenv').config()

let url = process.env.LINK_DB;

let dados = JSON.parse(fs.readFileSync("./db_scheema/db.js"));
let listaAlteracoes = [];
let listaTabelas = [];
let pathSnippets = "../aitSnippets/dbs_snippets/";

console.log("Solicitando definição atual....");
request.post({url: url, form :{}}, function (err, httpResponse, body) {
   if (!err && httpResponse.statusCode == 200) {

      let retorno = JSON.parse(body);

      console.log("Comparando dados atuais com recebidos...");
      var promise = retorno.map(function (obj, index){
         return Promise.resolve(pesqTabela(obj));
      });

     Promise.all(promise).then(function(results) {

      //percorre lista de alterações alterando snippets locais
      console.log("lendo alterações...");
      listaAlteracoes.map(function(obj, index){

         if (obj.movimento == "nvCampo") {
            console.log("Novo campo: " + obj.campo + " Tabela: " + obj.tabela);
            criaSnippet(obj);
         }else{
            //Modelo atual, um novo snippet também checa o dir da tabela e cria caso não exista
         }
      });

      if (listaAlteracoes.length > 0) {
         console.log("Criando versão e atualizando base local...");

         // cria nova pasta com data atual para salvar definição anterior
         let data = new Date();
         let vrs_dir_db = data.getDate() + "_" + (data.getMonth() + 1) + "_" + data.getYear();
         if (!fs.existsSync("./db_scheema/" + vrs_dir_db)) {
            fs.mkdirSync("./db_scheema/" + vrs_dir_db);
            fs.writeFileSync(("./db_scheema/" + vrs_dir_db + "/db.js"), JSON.stringify(dados), 'utf8');
         }else{
            fs.writeFileSync(("./db_scheema/" + vrs_dir_db + "/db.js"), JSON.stringify(dados), 'utf8');
         }
         // salva nova definição
         fs.writeFileSync(("./db_scheema/db.js"), JSON.stringify(retorno), 'utf8');
      }

     });
   }
});


function comparaCampos(tabNv, tabLc, nometab){
   return tabNv.map(function(campoNv, index){

      if (tabLc.find(function(campoLc, indice){
         //Se encontrar o campo na definição local, checa se deve atualizar tipo de formato
         if (campoNv.nome == campoLc.nome) {
            if (campoNv.tipo != campoLc.tipo) {
               listaAlteracoes.push(alteracao("nvCampo", nometab, campoNv.nome, campoNv.tipo, campoNv.format));
            }
            if (campoNv.format != campoLc.format) {
               listaAlteracoes.push(alteracao("nvCampo", nometab, campoNv.nome, campoNv.tipo, campoNv.format));
            }
            // retorna que encontrou campo
            return true;
         }
      }) == undefined) { //se não achar o campo na definição local criar
         listaAlteracoes.push(alteracao("nvCampo", nometab, campoNv.nome, campoNv.tipo, campoNv.format));
      }
   })
}

function pesqTabela(tabela){
   // Pesq tabela na definição local, se encontrar tabela compara campos
   if (dados.find(function(obj, index){
      if (obj.nome == tabela.nome) {
         comparaCampos(tabela.campos, obj.campos, tabela.nome);
         return true;
      }
   }) == undefined){ //se não encontrar tabela gera registro para buscar definição
      listaAlteracoes.push(alteracao("nvTab", tabela.nome, "", "", ""));
      comparaCampos(tabela.campos, [], tabela.nome);
   }
}

function alteracao(movimento, tabela, campo, tipo, format){
   return {movimento, tabela, campo, tipo, format};
};

function criaSnippet(obj){
   //se existe pasta da tabela
   if (fs.existsSync(pathSnippets + obj.tabela)) {

      let conteudo = `<snippet>
         <content><![CDATA[${obj.tabela + '.' + obj.campo}]]></content>
         <tabTrigger>${obj.tabela + '.' + obj.campo}</tabTrigger>
         <description>${obj.tipo + ' ' + obj.format}</description>
         <scope> text.html.abl </scope>
      </snippet>`;

      fs.writeFileSync((pathSnippets + obj.tabela + "/" + obj.campo.replace(/-/g, "_") + ".sublime-snippet"), conteudo, 'utf8');
   }else{
      fs.mkdirSync(pathSnippets + obj.tabela, function(){

         let conteudo = `<snippet>
            <content><![CDATA[${obj.tabela + '.' + obj.campo}]]></content>
            <tabTrigger>${obj.tabela + '.' + obj.campo}</tabTrigger>
            <description>${obj.tipo + ' ' + obj.format}</description>
            <scope> text.html.abl </scope>
         </snippet>`;

         fs.writeFileSync((pathSnippets + obj.tabela + "/" + obj.campo.replace(/-/g, "_") + ".sublime-snippet"), conteudo, 'utf8');

      });
   }
}

// { movimento: 'nvCampo',
//   tabela: 'ait-usuario',
//   campo: 'usr-cod1',
//   tipo: 'inte',
//   format: '999999' }


// let teste = [{ nome: 'ait-usuarios',
//   campos:
//    [ { nome: 'usr-cod', tipo: 'inte', format: '999999' },
//      { nome: 'usr-login', tipo: 'char', format: 'X(12)' },
//      { nome: 'usr-nome', tipo: 'char', format: 'X(35)' },
//      { nome: 'fil-cod', tipo: 'inte', format: '9999' },
//      { nome: 'pst-cod', tipo: 'inte', format: '>9' },
//      { nome: 'usr-adm', tipo: 'logi', format: 'Sim/N�o' },
//      { nome: 'usr-mail', tipo: 'char', format: 'X(50)' },
//      { nome: 'fnc-cod', tipo: 'inte', format: '>>9' },
//      { nome: 'gru-cod', tipo: 'inte', format: '999' },
//      { nome: 'usr-acessoun', tipo: 'logi', format: 'S/N' },
//      { nome: 'gun-cod', tipo: 'inte', format: '999' },
//      { nome: 'usr-habilitado', tipo: 'logi', format: 'Sim/N�o' },
//      { nome: 'Vper-cod', tipo: 'inte', format: '>>9' },
//      { nome: 'usr-func', tipo: 'logi', format: 'Sim/N�o' },
//      { nome: 'Vusr-ausente', tipo: 'logi', format: 'yes/no' },
//      { nome: 'usr-matr', tipo: 'inte', format: '99999999' },
//      { nome: 'Vfnc-codsubst', tipo: 'inte', format: '>>9' },
//      { nome: 'usr-cpf', tipo: 'char', format: 'xxx.xxx.xxx-xx' },
//      { nome: 'usr-spv', tipo: 'logi', format: 'Sim/N�o' },
//      { nome: 'usr-generico', tipo: 'logi', format: 'Sim/N�o' },
//      { nome: 'usr-apoio', tipo: 'logi', format: 'Sim/N�o' },
//      { nome: 'usr-dtultlogin', tipo: 'date', format: '99/99/9999' },
//      { nome: 'usr-dtultsenha', tipo: 'date', format: '99/99/9999' },
//      { nome: 'usr-spvinterfacegus', tipo: 'logi', format: 'Sim/N�o' },
//      { nome: 'usr-oracle', tipo: 'char', format: 'X(30)' },
//      { nome: 'usr-procesp', tipo: 'logi', format: 'Sim/N�o' },
//      { nome: 'usr-loginalt', tipo: 'char', format: 'X(12)' },
//      { nome: 'usr-dtalt', tipo: 'date', format: '99/99/9999' },
//      { nome: 'nus-objectguid', tipo: 'char', format: 'x(50)' },
//      { nome: 'prg-cod', tipo: 'char', format: 'X(11)' },
//      { nome: 'usr-senha', tipo: 'char', format: 'X(50)' },
//      { nome: 'usr-gis', tipo: 'char', format: 'X(12)' },
//      { nome: 'usr-gus', tipo: 'char', format: 'X(12)' },
//      { nome: 'usr-idipref', tipo: 'char', format: 'X(2)' },
//      { nome: 'xst-pai', tipo: 'char', format: 'X(8)' },
//      { nome: 'xst-opc', tipo: 'char', format: 'X' },
//      { nome: 'usr-batch', tipo: 'logi', format: 'Sim/N�o' },
//      { nome: 'usr-acessodyncrm', tipo: 'logi', format: 'yes/no' } ] }];


// var promise = teste.map(function (obj, index){
//    return Promise.resolve(pesqTabela(obj));
// })


// Promise.all(promise).then(function(results) {
//    //Verifica lista de alterações criadas para atualizar dir local
//    listaAlteracoes.map(function(obj, index){
//       if (obj.movimento == "nvCampo") {
//          criaSnippet(obj);
//       }else{
//          //Modelo atual, um novo snippet também checa o dir da tabela e cria caso não exista
//       }

//    })
// })