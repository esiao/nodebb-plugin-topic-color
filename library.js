(function(module) {
	"use strict";

	//Requirements
	var 	Topics = module.parent.require('./topics.js'),
		User = module.parent.require('./user.js'),
		Groups = module.parent.require('./groups.js'),
		async = require('async');

	//Global variables
	var colorify = false;

	var ColorifyTopics = {
		TestGroup : function (tid) {
			//console.log(tid);
			Topics.getTopicDataWithUser(tid, function(err, TopicData) {

				var username = TopicData.user.username;

				User.getUidByUsername(username, function(err, uid){

					var allowedGroups = [ 'administrators', 'Moderator', 'Test' ];
					async.some(allowedGroups, function(group){
						Groups.isMember(uid, group, function(err, allowed){
							if (allowed) colorify = true;
							exports.colorify = colorify;
						});	
					});

				});
			});
		}
	};

	module.exports = ColorifyTopics;

}(module));