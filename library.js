(function(module) {
	"use strict";

	var TopicColor = {};

	var SocketAdmin = module.parent.require('./socket.io/admin'),
		Sockets = module.parent.require('./socket.io/index'),
		Topics = module.parent.require('./topics.js');

	TopicColor.init = function() {
		SocketAdmin.topics = SocketAdmin.topics || {};
		SocketAdmin.topics.renameTopic = function(socket, data, callback) {
			if (!data.tid || !data.title) {
				return callback(false);
			}

			Topics.setTopicField(data.tid, 'title', data.title, callback);
		};
	};

	module.exports = TopicColor;
}(module));