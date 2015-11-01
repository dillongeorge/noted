Notes = new Mongo.Collection("notes");

Images = new FS.Collection("images", {
  stores: [new FS.Store.GridFS("images")]
});

var triggerPackeryLayout = function(){
  var $container = $('#notes-container');

  $container.packery({
    itemSelector: '.note',
    gutter: 10
  });
};

if (Meteor.isClient) {

  /**** Notes template ********/
  Meteor.startup(function(){

  });

  Template.notes.helpers({
    'note': function(){
      return Notes.find({}, {sort: {createdOn: -1}});
    },
    'noteImage': function(){
      return Images.findOne(this.imageId._id);
    },
    'rendered': function(){
      console.log("rendered");
      $('#notes-container').packery();
    }
  });

  Template.notes.onRendered(function(){
    this.find('#notes-container')._uihooks = {
      insertElement: function(node, next){
        triggerPackeryLayout();
        $('#notes-container').prepend(node);
        $('#notes-container').packery('prepended', node);
      }
    };
  });

  Template.notes.events({
    'click .note-content': function(event){
      event.preventDefault();
      var element = event.currentTarget;
      var self = this;
      var container = $('<div>').addClass("update-form-container");
      var title = $('<input id="update-note-title" type="text" placeholder="Title">')
        .addClass("form-control")
        .addClass("borderless")
        .addClass("update-note-title")
        .val(self.title);

      var content = $('<textarea id="update-note-content" placeholder="Note">')
        .addClass("form-control")
        .addClass("borderless")
        .addClass("update-note-content")
        .val(self.content);

      var updateNoteSubmit = function(){
        Meteor.call(
            "updateNote",
            self._id,
            $('#update-note-title').val(),
            $('#update-note-content').val(),
          );
          $.fancybox.close();
      };

      var submitButton = $('<input type="button" id="update-note-button" value="Submit">')
      .click(updateNoteSubmit);

      var submit = $('<div>')
        .addClass("update-note-options-container")
        .append(submitButton);

      container.append(title)
        .append(content)
        .append(submit);

      $.fancybox.open(container, {
                maxWidth  : 800,
                maxHeight : 600,
                fitToView : false,
                width   : '70%',
                height    : '70%',
                autoSize  : false,
                closeClick  : false,
                openEffect  : 'none',
                closeEffect : 'none',
                padding: 0,
                closeBtn: false
      });
    },
    'click .note-options': function(){
      console.log("Icon");
    },
    'mouseenter .note': function(){
      $('#' + this._id).fadeTo("fast", .75);
    },
    'mouseleave .note': function(){
      $('#' + this._id).fadeTo("fast", 0);
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
    insert: function(){ return true; },
    update: function(){ return true; },
    download: function(){ return true; },
    remove: function(){ return true; }
  })
}
