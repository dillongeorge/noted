Notes = new Mongo.Collection("notes");
Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images")]
});

if (Meteor.isClient) {

  Template.notes.helpers({
    'note': function(){
      return Notes.find({}, {sort: {createdOn: -1}});
    },
    'gridifyNote': function(note, image){
        var $note = $("<div>", {class: "grid-item"});

        $note.append($("<h3>", {class: "note-title"}).text(note.title));
        $note.append($("<p>", {class: "note-content"}).text(note.content));

        if(image){
          var imageUrl = Images.findOne(image._id).url();
          $note.append($("<img>", {class: "note-image", src: imageUrl}));
        }

        $('.grid').prepend($note).masonry('prepended', $note);
    }
  });

  Template.notes.onRendered(function(){
  });

  Template.dom_note.helpers({
    'noteImage': function(){
      return Images.findOne(this.imageId._id);
    },
    'size': function(content){
      if(content.length > 5) return "grid-item--gigante";
    }
  });

  Template.dom_note.onRendered(function(){
    $('#notes-container').isotope({
      itemSelector: '.grid-item',
      gutter: 20
    });
  });

  Template.addNoteForm.events({
    'click #note-submit': function(event){
      var title = $('#note-title').val();
      var content = $('#note-content').val();
      var file = $('#note-image')[0].files[0];

      var image = file ? Images.insert(file) : null;
      Meteor.call('insertNote', title, content, image);

      $('#note-title').val("");
      $('#note-content').val("");
      $('#note-image').val("");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });

  Meteor.methods({
    'updateNote': function(id, photoId){
      Notes.update(id, {$set: {imageId: photoId}});
    },
    'insertNote': function(noteTitle, noteContent, pid){
      Notes.insert({
        title: noteTitle,
        content: noteContent,
        createdBy: Meteor.userId(),
        imageId: pid,
        createdOn: new Date()
      });
    },
    'fetchImageUrl': function(imageId){
      return {url: Images.findOne(imageId).url()};
    }
  });

  Images.allow({
    insert: function(){
      return true;
    },
    update: function(){
      return true;
    },
    download: function(){ return true; }
  })
}
