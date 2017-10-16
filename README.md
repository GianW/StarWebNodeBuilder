#StarWebNodeBuilder

Run `npm install`

Sublime Build System
```
{
   "working_dir" : "C:/Users/Gian/AppData/Roaming/Sublime Text 3/Packages/User/StarWebNodeBuilder",
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
      "name": "GIS Prod",
      "cmd": ["node", "nodeBuild", "$file", "$file_name", "gisprod"]
      },
      {
      "name": "GIS GUS Prod",
      "cmd": ["node", "nodeBuild", "$file", "$file_name", "gisgusprod"]
      }
   ]
}

```