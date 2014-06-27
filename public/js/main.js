(function() {
	"use strict";

	function colorifyTopics() {
		//Change topic title on topic list
		$('.category-item .topic-title').each(function() {
			var title = $(this);
			var reg = /#([0-9A-Fa-f]{6})([^#]*)/g;
			if (title.html().match(reg)) {
				title.html( title.html().replace(reg,'<font color="#$1">$2</font>') );
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
	}

	jQuery('document').ready(function() {
		$(window).on('action:ajaxify.end', function(ev, data) {
			if (data.url.match(/^category/) || data.url.match(/^unread/) || data.url.match(/^recent/) || data.url.match(/^popular/)) {
				colorifyTopics();
			}

			if (data.url.match(/^topic/)) {

				/* Does not work yet */

				//Change topic <title>
				var reg = /#([0-9A-Fa-f]{6})([^#]*)/g;

				if (document.title.match(reg)) {
					document.title = document.title.replace(/#[0-9A-Fa-f]{6}/g,'');
				}
				//Window Url don't have #
				reg = /([0-9A-Fa-f]{6})/g;
				if (window.location.href.match(reg)) {
					document.title = window.location.href.replace(/#[0-9A-Fa-f]{6}/g,'');
				}
			}
		});

		$(window).on('action:categories.loaded', colorifyTopics);
		$(window).on('action:categories.new_topic.loaded', colorifyTopics);
		$(window).on('action:topic.loaded', colorifyTopics);
	});
}());