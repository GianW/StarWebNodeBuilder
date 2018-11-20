# StarWebNodeBuilder

Transport, backup, run code and compile for [StarWeb](http://www.starweb-software.com.br/home.htm)(OpenEdge ABL framework) using [Sublime Text](https://www.sublimetext.com/) and [NodeJS](https://nodejs.org/en/)

Run `npm install`

Set the Sublime Build System (Tools > Build System > New Build System...)


```
{
   "working_dir" : "$packages/User/StarWebNodeBuilder",
   "variants": [
      {
      "name": "GIS Dev",
      "cmd": ["node", "nodeBuild", "$file", "$file_name", "gisdesenv"]
      },
      {
      "name": "GIS GUS Dev",
      "cmd": ["node", "nodeBuild", "$file", "$file_name", "gisgusdesenv"]
      },
      {
      "name": "GIS SDT Dev",
      "cmd": ["node", "nodeBuild", "$file", "$file_name", "sdtgisdesenv"]
      },
      {
      "name": "GIS Prod",
      "cmd": ["node", "nodeBuild", "$file", "$file_name", "gisprod"]
      },
      {
      "name": "GIS GUS Prod",
      "cmd": ["node", "nodeBuild", "$file", "$file_name", "gisgusprod"]
      },
      {
      "name": "GIS SDT Prod",
      "cmd": ["node", "nodeBuild", "$file", "$file_name", "sdtgisprod"]
      },
      {
      "name": "Atualizar Local def",
      "cmd": ["node", "dbUpdate"]
      },
      {
      "name": "Exec code",
      "cmd": ["node", "codeExec", "$file"]
      },
      {
      "name": "Exec code Prod",
      "cmd": ["node", "codeExec", "$file", "prod"]
      }
   ]
}
```

Set .env var like this

```
DIR_TKE_DEV='dir_address'
DIR_TKE_PROD='dir_address'
LINK_WEB_DEV='starWeb_Dev_url'
LINK_WEB_PROD='starWeb_Prod_url'
DIR_BKP='dir_bkpLocal_optional'
LINK_DB='linkServiceToGetDBDefinition'
LINK_EXEC='starWebDevURL /progs/swfw0090'
LINK_EXEC_PROD='starWebProdURL /swfw0090'
```