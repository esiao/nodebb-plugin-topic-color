(function(module) {
	"use strict";

	//Requirements
	var 	Topics = module.parent.require('./topics.js'),
		User = module.parent.require('./user.js'),
		Groups = module.parent.require('./groups.js'),
		fs = require('fs'),
		path = require('path'),
		async = require('async');

	//Global variables
	var ColorifyTopics = {colorify : false};

	//Init plugin
	ColorifyTopics.init = function(app, middleware, controllers) {
		function render (req, res, next) {
			res.render('admin/plugins/topic-color', {});
		}

		app.get('/admin/plugins/topic-color', middleware.admin.buildHeader, render);
		app.get('/api/admin/plugins/topic-color', render);
	}

	//Test if user is in allowedGroups for topic.
	ColorifyTopics.testGroup = function (tid) {
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
	};
	//Build admin menu item.
	ColorifyTopics.admin = {
		menu: function (custom_header, callback) {
			custom_header.plugins.push({
				'route': '/plugins/topic-color',
				'icon': 'fa-tint',
				'name': 'Colorify Topics'
			});
			callback(null, custom_header);
		}
	};

	module.exports = ColorifyTopics;

}(module));