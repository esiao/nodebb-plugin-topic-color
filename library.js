(function(module) {
	"use strict";

	var TopicColor = {};

	var 	Topics = module.parent.require('./topics.js'),
		User = module.parent.require('./user.js'),
		Groups = module.parent.require('./groups.js');

	module.exports = TopicColor;
}(module));