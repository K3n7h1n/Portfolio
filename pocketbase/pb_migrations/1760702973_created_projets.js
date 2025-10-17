/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": "",
    "deleteRule": "",
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1819170229",
        "max": 100,
        "min": 3,
        "name": "nom",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text2560465762",
        "max": 100,
        "min": 3,
        "name": "slug",
        "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "file1596439714",
        "maxSelect": 1,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "photo_principale",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
        "hidden": false,
        "id": "file290148519",
        "maxSelect": 99,
        "maxSize": 0,
        "mimeTypes": [],
        "name": "galerie_photos",
        "presentable": false,
        "protected": false,
        "required": false,
        "system": false,
        "thumbs": [],
        "type": "file"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text398546678",
        "max": 0,
        "min": 0,
        "name": "description_courte",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text4149490183",
        "max": 0,
        "min": 0,
        "name": "description_complete",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select2363381545",
        "maxSelect": 1,
        "name": "type",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "design",
          "web",
          "communication",
          "video",
          "autre"
        ]
      },
      {
        "hidden": false,
        "id": "select1288436504",
        "maxSelect": 2,
        "name": "technologies",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "photoshop",
          "illustrator",
          "figma",
          "after-effects",
          "premiere-pro",
          "html/css/js",
          "astro/tailwind",
          "javascript",
          "pocketbase"
        ]
      },
      {
        "hidden": false,
        "id": "json1872127113",
        "maxSize": 0,
        "name": "informations",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "json"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1915095946",
        "max": 0,
        "min": 0,
        "name": "details",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "exceptDomains": null,
        "hidden": false,
        "id": "url2447981527",
        "name": "lien_figma",
        "onlyDomains": null,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "url"
      },
      {
        "exceptDomains": null,
        "hidden": false,
        "id": "url3356327903",
        "name": "lien_github",
        "onlyDomains": null,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "url"
      },
      {
        "hidden": false,
        "id": "select3848597695",
        "maxSelect": 1,
        "name": "statut",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "en_cours",
          "termine",
          "archive"
        ]
      },
      {
        "hidden": false,
        "id": "date3587986642",
        "max": "",
        "min": "",
        "name": "date_realisation",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "date"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3343123541",
        "max": 0,
        "min": 0,
        "name": "client",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "select1874629670",
        "maxSelect": 2,
        "name": "tags",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "identite-visuelle",
          "logo",
          "site-web",
          "application",
          "motion-design",
          "reseaux-sociaux",
          "illustration",
          "ui-ux"
        ]
      },
      {
        "hidden": false,
        "id": "number1102297642",
        "max": null,
        "min": null,
        "name": "ordre_affichage",
        "onlyInt": false,
        "presentable": false,
        "required": false,
        "system": false,
        "type": "number"
      },
      {
        "hidden": false,
        "id": "bool308064879",
        "name": "afficher",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_621264433",
    "indexes": [],
    "listRule": "",
    "name": "projets",
    "system": false,
    "type": "base",
    "updateRule": "",
    "viewRule": ""
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433");

  return app.delete(collection);
})
