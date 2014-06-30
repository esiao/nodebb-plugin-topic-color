(function() {
	"use strict";

	jQuery('document').ready(function() {

		$(window).on('action:ajaxify.end', function(ev, data) {
			if (data.url.match(/^category/) || data.url.match(/^unread/) || data.url.match(/^recent/) || data.url.match(/^popular/)) {
				colorifyTopics();
			}
		});

		$(window).on('action:categories.loaded', colorifyTopics);
		$(window).on('action:categories.new_topic.loaded', colorifyTopics);
		$(window).on('action:topic.loaded', colorifyTopics);

	});

	function colorifyTopics() {
		//Change topic title on topic list
		$('.category-item .topic-title').each(function() {
			var title = $(this);
			var reg = /#([0-9A-Fa-f]{6})([^#]*)/g;
			if (title.html().match(reg)) {
				title.html( title.html().replace(reg,'<font color="#$1">$2</font>') );
				reg = /([0-9A-Fa-f]{6})/g;
				title.attr('href', title.attr('href').replace(reg,'') );
			}
		});
		//Change topic title on topic
		$('h3.topic-title p.topic-title').each(function() {
			var title = $(this);
			var reg = /#([0-9A-Fa-f]{6})([^#]*)/g;
			if (title.html().match(reg)) {
				title.html( title.html().replace(reg,'<font color="#$1">$2</font>') );
			}
		});
		//Change Breadcrump
		$('ol.breadcrumb li.active span').each(function() {
			var title = $(this);
			var reg = /#([0-9A-Fa-f]{6})/g;
			if (title.html().match(reg)) {
				title.html( title.html().replace(reg,'') );
			}
		});
		var reg = /#([0-9A-Fa-f]{6})/g;
		document.title = document.title.replace(reg, '');
	}
}());