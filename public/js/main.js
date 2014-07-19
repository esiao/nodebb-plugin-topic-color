(function() {
	"use strict";

	$('document').ready(function() {

		var allowedGroups = ['Bucket','Moderator'];

		$(window).on('action:ajaxify.end', function(ev, data) {

			if (data.url.match(/^category/) || data.url.match(/^unread/) || data.url.match(/^recent/) || data.url.match(/^popular/)) {

				var index = [];
				var count = 0;

				/* Who posted the topic */
				var request = window.location.origin+'/api/'+data.url;
				$.getJSON(request, function (data) {
					var topics = data.topics;
					$.each(topics, function(el, topic){

						var uid = topic.uid,
						inGroups = [];

						/* In which groups is the user */
						var request = window.location.origin+'/api/groups';
						$.getJSON(request, function (data) {

							$.each(data.groups, function (i, group){
								$.each(group.members, function (i, member) {
									if (member.uid == uid) {
										inGroups.push(group.name);
									}
								});
							});

							count++;
							var match = $.grep(inGroups, function(element) {
							    	return $.inArray(element, allowedGroups) !== -1;
							});
							if (match.length > 0) {
								index.push(el);
							}
							if (count == topics.length) {
								colorifyTopics(index);
							}
						});
					});						
				});
			}
		});

		$(window).on('action:topic.loaded', function (data) {
			var request = window.location.origin+'/api'+window.location.pathname;
			$.getJSON(request, function (topic) {

				var uid = topic.uid,
				inGroups = [];

				/* In which groups is the user */
				var request = window.location.origin+'/api/groups';
				$.getJSON(request, function (data) {

					$.each(data.groups, function (i, group){
						$.each(group.members, function (i, member) {
							if (member.uid == uid) {
								inGroups.push(group.name);
							}
						});
					});

					var match = $.grep(inGroups, function(element) {
					    	return $.inArray(element, allowedGroups) !== -1;
					});
					if (match.length > 0) {
						colorifyTopics('allow');
					} else {
						colorifyTopics('deny');
					}
				});
			});
		});

		socket.on('event:post_edited', function() {
			var request = window.location.origin+'/api'+window.location.pathname;
			$.getJSON(request, function (topic) {

				var uid = topic.uid,
				inGroups = [];

				/* In which groups is the user */
				var request = window.location.origin+'/api/groups';
				$.getJSON(request, function (data) {

					$.each(data.groups, function (i, group){
						$.each(group.members, function (i, member) {
							if (member.uid == uid) {
								inGroups.push(group.name);
							}
						});
					});

					var match = $.grep(inGroups, function(element) {
					    	return $.inArray(element, allowedGroups) !== -1;
					});
					if (match.length > 0) {
						setTimeout(function(){colorifyTopics('allow')},270);
					} else {
						setTimeout(function(){colorifyTopics('deny')},270);
					}
				});
			});
		});

	});

	function colorifyTopics(allowed) {
		//Change topic title on topic list
		$('.category-item .topic-title').each(function(index) {
			var title = $(this);
			var reg = /%\((#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|(rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\))|([a-z]){3,})\)(\[([^%\(]*)\])/g;
			if ($.inArray(index, allowed) !== -1) {
				if (title.html().match(reg)) {
					var url = title.html().toLowerCase().replace(reg,'$9');
					title.html( title.html().replace(reg,'<font style="color:$1">$9</font>') );
					reg = /[^a-z0-9]+/g;
					url = url.trim().replace(reg,'-');
					reg = /(\/topic\/\d*\/)(.*)/;
					title.attr( 'href', title.attr('href').replace(reg,'$1'+url) );
				} 		
			} else {
				if (title.html().match(reg)) {
					var url = title.html().replace(reg,'$9').toLowerCase();
					title.html( title.html().replace(reg,'$9') );
					reg = /[^a-z0-9]+/g;
					url = url.trim().replace(reg,'-');
					reg = /(\/topic\/\d*\/)(.*)/;
					title.attr( 'href', title.attr('href').replace(reg,'$1'+url) );
				}
			}
		});
		//Change topic title on topic
		$('h3.topic-title p.topic-title').each(function() {
			var title = $(this);
			var reg = /%\((#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|(rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\))|([a-z]){3,})\)(\[([^%\(]*)\])/g;
			if (allowed == 'allow') {
				if (title.html().match(reg)) {
					title.html( title.html().replace(reg,'<font style="color:$1">$9</font>') );
				}
			} else {
				if (title.html().match(reg)) {
					title.html( title.html().replace(reg,'$9') );
				}
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
		//Change document title
		var reg = /%\((#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|(rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\))|([a-z]){3,})\)(\[([^%\(]*)\])/g;
		document.title = document.title.replace(reg, '$9');
	}

}());