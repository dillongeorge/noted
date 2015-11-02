Notes = new Mongo.Collection("notes");

Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images")]
});

if (Meteor.isClient) {

}

if (Meteor.isServer) {

  var COLORS = ["RED", "ORANGE", "YELLOW",
    "GRAY", "BLUE", "TEAL", "GREEN"];

  var randomColor = function(){
    var rand = Math.floor(Math.random() * COLORS.length);
    return COLORS[rand];
  }

  Meteor.methods({
    'updateNote': function(id, noteTitle, noteContent){
        Notes.update({_id: id}, {$set:
          {
            title: noteTitle, 
            content: noteContent
          }
      });
    },
    'insertNote': function(noteTitle, noteContent, pid){
      var color = randomColor();
      Notes.insert({
        title: noteTitle,
        content: noteContent,
        createdBy: Meteor.userId(),
        imageId: pid,
        color: color,
        createdOn: new Date()
      });
    },
    'removeNote': function(note){
      var currentUser = Meteor.userId();
      Notes.remove({_id: note});
    }
  });

  Images.allow({
    insert: function(){ return true; },
    update: function(){ return true; },
    download: function(){ return true; },
    remove: function(){ return true; }
  })
}
