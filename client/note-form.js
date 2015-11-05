var clearFields = function(){
  $("#note-title").val("");
  $("#note-body").val("");
  $("#note-image").val("");
  $("#preview-image").removeAttr("src");
  $("#preview-image-container").addClass("hidden");
};

Template.addNoteForm.events({
  'click #note-submit': function(event){
    var title = $('#note-title').val();
    var content = $('#note-body').val();
    var file = $('#note-image')[0].files[0];

    if(!title && !content && !file)
      return;

    var image = null;
    
    if(file){
      file = new FS.File(file);
      file.owner = Meteor.userId();
      image = Images.insert(file);
    }

    Meteor.call("insertNote", title, content, image);

    clearFields();
  },
  'click #note-clear': function(){
    clearFields();
  },
  'change #note-image': function(){
    var file = $("#note-image")[0].files[0];
    $("#preview-image-container").removeClass("hidden");
    if(file){
      var fReader = new FileReader();
      fReader.onload = function(event){
        $("#preview-image").attr("src", event.target.result);
      };
      fReader.readAsDataURL(file);
    }
  }
});