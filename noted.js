Notes = new Mongo.Collection("notes");

if (Meteor.isClient) {
  Template.notes.helpers({
    'note': function(){
      return Notes.find({}, {sort: {createdOn: -1}});
    }
  })

  Template.addNoteForm.events({
    'submit form': function(event){
      event.preventDefault();

      var noteTitle = event.target.noteTitle.value;
      var noteContent = event.target.noteContent.value;
      var user = Meteor.userId();

      Notes.insert({
        title: noteTitle,
        content: noteContent,
        createdBy: user,
        createdOn: new Date()
      });

      event.target.noteTitle.value = "";
      event.target.noteContent.value = "";
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
