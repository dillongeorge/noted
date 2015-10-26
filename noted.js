Notes = new Mongo.Collection("notes");
Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {path: "~/uploads"})]
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
      var $note = $("<div>", {class: "grid-item"});

      $note.append($("<h3>", {class: "note-title"}).text(noteTitle));
      $note.append($("<p>", {class: "note-content"}).text(noteContent));

      if(noteImageId){
        var imageUrl = Images
          .find(noteImageId)
          .fetch()[0]
          .url();

        $note.append($("<img>", {class: "note-image", src: imageUrl}));
        console.log(imageUrl);
      } 

      $('.grid').prepend($note).masonry('prepended', $note);
    }
  })

  Template.addNoteForm.events({
    'submit form': function(event){
      event.preventDefault();

      var noteTitle = event.target.noteTitle.value;
      var noteContent = event.target.noteContent.value;
      var file = event.target.noteImage.files[0] || null;
      var user = Meteor.userId();

      if(file)
        var imageId = Images.insert(file)._id;

      Notes.insert({
        title: noteTitle,
        content: noteContent,
        createdBy: user,
        image_id: imageId || null,
        createdOn: new Date()
      });

      event.target.noteTitle.value = "";
      event.target.noteContent.value = "";
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    
  });

  Images.allow({
    insert: function(){
      return true;
    },
    download: function(){
      return true;
    }
  })
}
