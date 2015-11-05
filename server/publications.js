Meteor.publish("notes", function(userId){
  return Notes.find({createdBy: this.userId});
});

Meteor.publish("images", function(){
	return Images.find();
});