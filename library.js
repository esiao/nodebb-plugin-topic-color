"use strict";
var db = module.parent.require('./database');

(function(ColorifyTopics) {
	var defaultGroup = ['Bucket'],
	allowedGroups = defaultGroup;

	//Retieve database and get information or create
	db.getObject('plugins:topic-color', function(err, data) {
		if (data) {
			allowedGroups = data.allowedGroups ? data.allowedGroups : data.defaultGroup;
		}
	});

	//Build admin render
	function renderAdmin (req, res, next) {
		db.getObject('plugins:topic-color', function(err, data) {
			if (err) return next(err);
			if (!data) {
				data = { allowedGroups : defaultGroup };
			}
			res.render('admin/plugins/topic-color', data);
		});
	};

	//Create the save function
	function save (req, res, next) {

		var data = { allowedGroups : req.body.allowedGroups };

		db.setObject('plugins:topic-color', data, function(err) {

			if (err) {
				return res.json(500, 'Error while saving settings');
			}

			res.json('Settings successfully saved');
		});

	}

	//Init plugin
	ColorifyTopics.init = function (app, middleware, controllers) {
		app.get('/admin/plugins/topic-color', middleware.admin.buildHeader, renderAdmin);
		app.get('/api/admin/plugins/topic-color', renderAdmin);

		app.post('/api/admin/plugins/topic-color/save', save);
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

}(module.exports));