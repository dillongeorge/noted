var triggerPackeryLayout = function(){
  var $container = $('#notes-container');

  $container.packery({
    itemSelector: '.note',
    gutter: 20
  });
};

Template.notes.helpers({
  'note': function(){
    return Notes.find({}, {sort: {createdOn: -1}});
  },
  'noteImage': function(){
    return Images.findOne(this.imageId._id);
  },
  'rendered': function(){
    console.log("notes");
    $('#notes-container').packery();
  }
});

Template.notes.onRendered(function(){
  this.find('#notes-container')._uihooks = {
    insertElement: function(node, next){
      triggerPackeryLayout();
      $('#notes-container').prepend(node);
      $('#notes-container').packery('prepended', node);
    },
    removeElement: function(node, next){
      node.remove();
      $('#notes-container').packery();
    }
  };
});

Template.notes.events({
  'click .note-content': function(event){
    event.preventDefault();

    var note = this;

    /** Prettybox container **/
    var container = $('<div>').addClass("update-form-container");

    /** Image container Code **/
      var imageContainer = $('<div>')
        .addClass('image-container');

      var span = $('<span>')
        .addClass("vertical-align-helper");

    if(note.imageId){
      var imageUrl = note.imageId.url();

      var image = $('<img>')
        .addClass('update-image')
        .attr('src', imageUrl);

      imageContainer.append(span).append(image);
    }else{
      imageContainer
        .append(span)
        .append("No Image");
    }

    /** Content Container Code **/

    var contentContainer = $('<div>')
      .addClass("content-container");

    var title = $('<input id="update-note-title" type="text" placeholder="Title">')
      .addClass("form-control")
      .addClass("borderless")
      .addClass("update-note-title")
      .val(note.title);

    var content = $('<textarea id="update-note-content" placeholder="Note">')
      .addClass("form-control")
      .addClass("borderless")
      .addClass("update-note-content")
      .val(note.content);

    var updateNoteSubmit = function(){
      Meteor.call(
          "updateNote",
          note._id,
          $('#update-note-title').val(),
          $('#update-note-content').val(),
        );
        $.fancybox.close();
    };

    var submitButton = $('<input type="button" id="update-note-button" value="Done">')
    .addClass('btn')
    .addClass('btn-default')
    .addClass('minimal-btn')
    .click(updateNoteSubmit);

    var submitContainer = $('<div>')
      .addClass("update-note-options-container")
      .append(submitButton);

    contentContainer.append(title)
      .append(content)
      .append(submitContainer);

    /** Put it all together **/

    container.append(imageContainer)
      .append(contentContainer);

    $.fancybox.open(container, {
        maxWidth  : 1200,
        maxHeight : 700,
        minWidth: 500,
        minHeight: 500,
        fitToView : false,
        width   : '80%',
        height    : '70%',
        autoSize  : false,
        closeClick  : false,
        openEffect  : 'none',
        closeEffect : 'none',
        padding: 0,
        closeBtn: false,
        beforeShow : function(){
         $(".fancybox-inner").addClass(note.color);
        }
    });
  },
  'click .delete-note': function(){
    Meteor.call("removeNote", this._id);
  },
  'mouseenter .note': function(){
    $('#' + this._id).fadeTo("fast", .75);
  },
  'mouseleave .note': function(){
    $('#' + this._id).fadeTo("fast", 0);
  }
});