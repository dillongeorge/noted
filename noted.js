Notes = new Mongo.Collection("notes");

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
    'gridifyNote': function(noteTitle, noteContent){
      console.log(noteTitle);
      var $item = $("<div class='grid-item'><h3>"+noteTitle+
        "</h3><p>test</p></div>");
      $('.grid').prepend($item).masonry('prepended', $item);
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
    
  });
}
