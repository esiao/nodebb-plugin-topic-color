(function(module) {
	"use strict";

	//Gonstruct object
	var ColorifyTopics = {};

	//Init plugin
	ColorifyTopics.init = function(app, middleware, controllers) {
		function render (req, res, next) {
			res.render('admin/plugins/topic-color', {});
		}

		app.get('/admin/plugins/topic-color', middleware.admin.buildHeader, render);
		app.get('/api/admin/plugins/topic-color', render);
	}

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