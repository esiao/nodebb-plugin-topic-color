"use strict";

var 	db = module.parent.require('./database'),
	colorifyTopics = {},
	defaultGroup = ['Bucket'];

colorifyTopics.init = function (app, middleware, controllers, callback) {

	app.get('/admin/plugins/topic-color', middleware.admin.buildHeader, renderAdmin);
	app.get('/api/admin/plugins/topic-color', renderAdmin);
	app.get('/api/plugins/topic-color', renderFront);

	app.post('/api/admin/plugins/topic-color/save', save);

	callback();
};

colorifyTopics.addAdminNavigation = function(header, callback) {
	
	header.plugins.push({
		route: '/plugins/topic-color',
		icon: 'fa-tint',
		name: 'Topic Color'
	});

	callback(null, header);
};

function render (res, next, path) {

	db.getObject('plugins:topic-color', function(err, data) {
		if (err) {
			return next(err);
		}
		if (!data) {
			data = { allowedGroups : defaultGroup };
		}
		res.render(path, data);
	});
}

function renderAdmin (req, res, next) { render( res, next, 'admin/plugins/topic-color' ) }
function renderFront (req, res, next) { render( res, next, 'plugins/topic-color' ) }

function save (req, res, next) {

	var data = { allowedGroups : req.body.allowedGroups };
	db.setObject('plugins:topic-color', data, function(err) {
		err ? res.json(500, 'Error while saving settings') : res.json('Settings successfully saved');
	});
}

module.exports = colorifyTopics;