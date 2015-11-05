Meteor.subscribe("notes");
Meteor.subscribe("images");

Template.notes.helpers({
  'note': function(){
    return Notes.find({}, {sort: {createdOn: -1}});
  },
  'noteImage': function(){
    return Images.findOne(this.image._id);
  },
  'packery': function(){
    var $container = $("#notes-container");

    $container.imagesLoaded(function(){
      $('#notes-container').packery();
    });
  },
  'sizeNote': function(){
      var content = this.content
      if(content.length <= 40 || 
        (!this.title && !this.content)) return "small";
      else if(content.length <= 140) return "medium";
      else return "large";
  },
  'sizeText':function(){
    if(this.image) return "small";

    var content = this.content;
    if(content.length <= 40) return "large";
    else if(content.length <= 140) return "medium"
    else return "small";
  }
});

Template.notes.onRendered(function(){
  this.find("#notes-container")._uihooks = {
    insertElement: function(node, next){
      var $container = $("#notes-container");

      $container.imagesLoaded(function(){
        triggerPackeryLayout();
        $container.prepend(node);
        $container.packery("prepended", node);
      });

    },
    removeElement: function(node, next){
      node.remove();
      $("#notes-container").packery();
    }
  };
});

Template.notes.events({
  'click .note-content': function(event){
    event.preventDefault();
    createFancyBox(this);
  },
  'click .delete-note': function(){
    Meteor.call("removeNote", this._id);
  },
  'mouseenter .note': function(){
    $("#" + this._id).fadeTo("fast", .75);
  },
  'mouseleave .note': function(){
    $("#" + this._id).fadeTo("fast", 0);
  }
});

/* Used to trigger packery layout in uihooks */
var triggerPackeryLayout = function(){
  var $container = $("#notes-container");

  $container.packery({
    itemSelector: '.note',
    percentPosition: true,
    gutter: 20
  });
};

/* Dynamically build HTML for lightbox popup when user edits 
  existing note */
var createFancyBox = function(note){

    if(!note) 
      throw new Meteor.Error("Null Note!");;

    /** Prettybox container **/
    var container = $("<div>").addClass("update-form-container");

    /** Image container Code **/
      var imageContainer = $("<div>")
        .addClass("image-container");

      var span = $("<span>")
        .addClass("vertical-align-helper");

    if(note.image){
      var imageUrl = note.image.url();

      var image = $("<img>")
        .addClass("update-image")
        .attr("src", imageUrl);

      imageContainer.append(span).append(image);
    }else{
      imageContainer
        .append(span)
        .append("No Image");
    }

    /** Content Container Code **/

    var contentContainer = $("<div>")
      .addClass("content-container");

    var title = $("<input id='update-note-title' type='text' placeholder='Title'>")
      .addClass("form-control")
      .addClass("minimal")
      .addClass("update-note-title")
      .val(note.title);

    var content = $("<textarea id='update-note-content' placeholder='Note'>")
      .addClass("form-control")
      .addClass("minimal")
      .val(note.content);

    var updateNoteSubmit = function(){
      Meteor.call(
          "updateNote",
          note._id,
          $("#update-note-title").val(),
          $("#update-note-content").val(),
        );
        $.fancybox.close();
    };

    var submitButton = $("<input type='button' id='update-note-button' value='Done'>")
    .addClass("btn")
    .addClass("btn-default")
    .addClass("minimal-btn")
    .click(updateNoteSubmit);

    var submitContainer = $("<div>")
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
}