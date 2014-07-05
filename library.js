(function(module) {
	"use strict";

	var 	Topics = module.parent.require('./topics.js'),
		User = module.parent.require('./user.js'),
		Groups = module.parent.require('./groups.js');

	var plugin = {
		TestGroup : function (tid) {
				//console.log(tid);
			Topics.getTopicDataWithUser(tid, function(err, TopicData) {

				var username = TopicData.user.username;

				User.getUidByUsername(username, function(err, uid){
					console.log(uid);
				});

			});
		}
	};

	module.exports = plugin;

}(module));