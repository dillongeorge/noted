Meteor.publish("notes", function(){
  return Notes.find({createdBy: this.userId});
});

Meteor.publish("images", function(){
	return Images.find();
});