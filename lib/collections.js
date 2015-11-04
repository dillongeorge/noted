Notes = new Mongo.Collection("notes");

Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images")]
});