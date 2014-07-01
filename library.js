(function(module) {
	"use strict";

	var 	topics = module.parent.require('./topics.js'),
		user = module.parent.require('./user.js'),
		groups = module.parent.require('./groups.js');

	var TopicColor = {
		ColorTitle : function (postData) {
			topics.getTopicField(postData, 'title', function(err, title) {
				var reg = /#([0-9A-Fa-f]{6})([^#]*)/g;
		    		title = title.replace(reg,'<font color="#$1">$2</font>');
		    		console.log(title);
		    		topics.setTopicField(postData, 'title', title);
			});
		}
	};

	module.exports = TopicColor;
}(module));