/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  // remove field
  collection.fields.removeById("text4149490183")

  // add field
  collection.fields.addAt(18, new Field({
    "convertURLs": false,
    "hidden": false,
    "id": "editor4149490183",
    "maxSize": 0,
    "name": "description_complete",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "editor"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_621264433")

  // add field
  collection.fields.addAt(6, new Field({
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
  }))

  // remove field
  collection.fields.removeById("editor4149490183")

  return app.save(collection)
})
