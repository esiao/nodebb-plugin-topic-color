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

					/*Working but not as permissive as wanted.
					Groups.isMember(uid, 'administrators', function(err, allowed){
						console.log(allowed);
					});*/
					Groups.isMemberOfGroups(uid, ['administrators','Moderator'], function(err, allowed){
						console.log(allowed);
					});

				});

			});
		}
	};

	module.exports = plugin;

}(module));