var COLORS = ["RED", "ORANGE", "YELLOW",
  "GRAY", "BLUE", "TEAL", "GREEN"];

var randomColor = function(){
  var rand = Math.floor(Math.random() * COLORS.length);
  return COLORS[rand];
};

Meteor.methods({
  'updateNote': function(id, noteTitle, noteContent){
    
    if(!Meteor.userId())
      throw new Meteor.Error("Unauthorized!");

      Notes.update({_id: id}, {$set:
        {
          title: noteTitle, 
          content: noteContent
        }
    });
  },
  'insertNote': function(noteTitle, noteContent, photo){
    
    if(!Meteor.userId())
      throw new Meteor.Error("Unauthorized!");

    var color = randomColor();
    Notes.insert({
      title: noteTitle,
      content: noteContent,
      createdBy: Meteor.userId(),
      image: photo,
      color: color,
      createdOn: new Date()
    });
  },
  'removeNote': function(noteId){

    if(! Meteor.userId())
      throw new Meteor.Error("Unauthorized!");

    var note = Notes.findOne({_id: noteId});
    
    if(note.image)
      Images.remove({_id: note.image._id});

    Notes.remove({_id: noteId, createdBy: Meteor.userId()});
  }
});