(function() {
	"use strict";

	jQuery('document').ready(function() {

		$(window).on('action:ajaxify.end', function(ev, data) {
			if (data.url.match(/^category/) || data.url.match(/^unread/) || data.url.match(/^recent/) || data.url.match(/^popular/)) {
				colorifyTopics();
			}
			if (data.url.match(/^topic/)) $(window).on('scroll',colorifyTopics);
		});

		$(window).on('action:categories.loaded', colorifyTopics);
		$(window).on('action:categories.new_topic.loaded', colorifyTopics);
		$(window).on('action:topic.loaded', colorifyTopics);

		socket.on('event:post_edited', function() {
		    setTimeout(colorifyTopics,270);
		});

		

	});

	function colorifyTopics() {
		//Change topic title on topic list
		$('.category-item .topic-title').each(function() {
			var title = $(this);
			var reg = /%\((#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|(rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\))|([a-z]){3,})\)(\[([^%\(]*)\])/g;
			if (title.html().match(reg)) {
				var url = title.html().replace(reg,'$9').toLowerCase();
				title.html( title.html().replace(reg,'<font style="color:$1">$9</font>') );
				reg = /(\/topic\/\d*\/)(.*)/;
				title.attr( 'href', title.attr('href').replace(reg,'$1'+url) );
			}
		});
		//Change topic title on topic
		$('h3.topic-title p.topic-title').each(function() {
			var title = $(this);
			var reg = /%\((#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|(rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\))|([a-z]){3,})\)(\[([^%\(]*)\])/g;
			if (title.html().match(reg)) {
				title.html( title.html().replace(reg,'<font style="color:$1">$9</font>') );
			}
		});
		//Change Breadcrump
		$('ol.breadcrumb li.active span').each(function() {
			var title = $(this);
			var reg = /%\((#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|(rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\))|([a-z]){3,})\)(\[([^%\(]*)\])/g;
			if (title.html().match(reg)) {
				title.html( title.html().replace(reg,'$9') );
			}
		});
		//Change header information
		$('.header-topic-title span').each(function() {
			var title = $(this);
			var reg = /%\((#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|(rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\))|([a-z]){3,})\)(\[([^%\(]*)\])/g;
			if (title.html().match(reg)) {
				title.html( title.html().replace(reg,'$9') );
			}
		});
		var reg = /%\((#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|(rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\))|([a-z]){3,})\)(\[([^%\(]*)\])/g;
		document.title = document.title.replace(reg, '$9');
	}
}());