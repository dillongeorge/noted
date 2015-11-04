Images.allow({
  insert: function(userId, file){ return userId == file.owner; },
  update: function(userId, file){ return userId == file.owner; },
  download: function(userId, file){ return userId == file.owner; },
  remove: function(userId, file){ return userId == file.owner; }
});

Meteor.users.deny({
	//Disable ability to edit user accounts
	update: function(){ return true; }
});