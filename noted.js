Notes = new Mongo.Collection("notes");
Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images")]
});

if (Meteor.isClient) {
  
  Meteor.startup(function(){
    var $grid = $('.grid').masonry({
      itemSelector: '.grid-item',
      columnWidth: 200
    });

    $grid.on( 'click', '.grid-item', function() {
      // change size of item via class
      $( this ).toggleClass('grid-item--gigante');
      // trigger layout
      $grid.masonry();
    });
  });

  Template.notes.helpers({
    'note': function(){
      return Notes.find({}, {sort: {createdOn: -1}});
    },
    'gridifyNote': function(noteTitle, noteContent, noteImageId){
      if(noteImageId){
        Meteor.call("fetchImageUrl", noteImageId, function(error, result){
          console.log(result.url);
          var url = result.url;
          console.log(url);
          var $note = $("<div>", {class: "grid-item"});
          $note.append($("<img>", {class: "note-image", src: url}));

        $note.append($("<h3>", {class: "note-title"}).text(noteTitle));
        $note.append($("<p>", {class: "note-content"}).text(noteContent));
          $('.grid').prepend($note).masonry('prepended', $note);
        });
      }
    },
    'noteImage': function(){
      return Images.findOne(this.imageId._id);
    },
    'gridify': function(){
      $('.grid').masonry();
    }
  })

  Template.addNoteForm.events({
    'submit form': function(event){
      event.preventDefault();

      var noteTitle = event.target.noteTitle.value;
      var noteContent = event.target.noteContent.value;
      var file = event.target.noteImage.files[0] || null;

      var image = file ? Images.insert(file) : null;
      Meteor.call('insertNote', noteTitle, noteContent, image);

      event.target.noteTitle.value = "";
      event.target.noteContent.value = "";
    }
  })
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
