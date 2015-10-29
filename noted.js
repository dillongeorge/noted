Notes = new Mongo.Collection("notes");
Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images")]
});

if (Meteor.isClient) {

  /**** Notes template ********/

  Template.notes.helpers({
    'note': function(){
      return Notes.find({}, {sort: {createdOn: -1}});
    },
    'noteImage': function(){
      return Images.findOne(this.imageId._id);
    }
  });

  Template.notes.onRendered(function(){

    var triggerPackeryLayout = function(){
      var $container = $('#notes-container');

      $container.packery({
        itemSelector: '.item',
        gutter: 20
      });
    };

    this.find('#notes-container')._uihooks = {
      insertElement: function(node, next){
        triggerPackeryLayout();
        $('#notes-container').prepend(node);
        $('#notes-container').packery('prepended', node);
      }
    }
  });

  Template.notes.events({
    'click .item': function(){
      console.log(this);
    }
  })

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
