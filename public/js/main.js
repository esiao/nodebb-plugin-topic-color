(function() {
	"use strict";

	$('document').ready(function() {

		var allowedGroups = ['Bucket'];

		var request = window.location.origin+'/api/plugins/topic-color';
		$.getJSON(request, function (data) {
                        allowedGroups = JSON.parse(data.allowedGroups);
                    });

		$(window).on('action:ajaxify.end', function(ev, data) {

			if (data.url.match(/^category/) || data.url.match(/^unread/) || data.url.match(/^recent/) || data.url.match(/^popular/) || data.url.match(/^user\/([a-z0-9])+\/topics/)) {

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
			} else if (data.url.match('')) {

				var index = [];
				var count = 0;

				/* Who posted the topic */
				var request = window.location.origin+'/api/';
				$.getJSON(request, function (data) {
					
					$.each(data.categories, function (i, category){
						var posts = category.posts;
						$.each(category.posts, function (el, post) {

							var uid = post.uid,
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
								if (count == posts.length) {
									colorifyTopics(index);
								}
							});
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
						$(window).on('scroll',function(){colorifyTopics('allow')});
					} else {
						colorifyTopics('deny');
						$(window).on('scroll',function(){colorifyTopics('deny')});
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

		//Notifications dropdown menu
		$('.notifications').on('click',function () {
			setTimeout(function () {
				$('#notif-list .text').each(function(){
					var title = $(this);
					var reg = /%\((#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|(rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\))|([a-z]){3,})\)(\[([^%\(]*)\])/g;
					if (title.html().match(reg)) {
						title.html( title.html().replace(reg,'$9') );
					}
				});
			},20)
		});
		//Widgets
		$(window).on('action:widgets.loaded', function () {
			setTimeout(function () {
				$('#recent_topics li a').each(function(){
					var title = $(this);
					var reg = /%\((#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|(rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\))|([a-z]){3,})\)(\[([^%\(]*)\])/g;
					if (title.html().match(reg)) {
						var url = title.html().replace(reg,'$9').toLowerCase();
						title.html( title.html().replace(reg,'$9') );
						reg = /[^a-z0-9]+/g;
						url = url.trim().replace(reg,'-');
						reg = /(\/topic\/\d*\/)(.*)/;
						if (title.attr('href') != undefined) {
							title.attr( 'href', title.attr('href').replace(reg,'$1'+url) );
						} else {
							title.parent('a').attr( 'href', title.parent('a').attr('href').replace(reg,'$1'+url) );
						}
					}
				});
			},200);
		});
		//Notifications
		$('.notifications-list a[href*="/topic/"]').each(function () {
			var title = $(this);
			var reg = /%\((#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|(rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\))|([a-z]){3,})\)(\[([^%\(]*)\])/g;
			if (title.html().match(reg)) {
				var url = title.html().replace(reg,'$9').toLowerCase();
				title.html( title.html().replace(reg,'$9') );
				reg = /[^a-z0-9]+/g;
				url = url.trim().replace(reg,'-');
				reg = /(\/topic\/\d*\/)(.*)/;
				if (title.attr('href') != undefined) {
					title.attr( 'href', title.attr('href').replace(reg,'$1'+url) );
				} else {
					title.parent('a').attr( 'href', title.parent('a').attr('href').replace(reg,'$1'+url) );
				}
			}
		});
	});

	function colorifyTopics(allowed) {
		//Change topic title on home & topic list
		$('.post-preview a[href*="/topic/"], .category-item .topic-title').each(function (index) {
			var title = $(this);
			var reg = /%\((#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})|(rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\))|([a-z]){3,})\)(\[([^%\(]*)\])/g;
			if ($.inArray(index, allowed) !== -1) {
				if (title.html().match(reg)) {
					var url = title.html().toLowerCase().replace(reg,'$9');
					title.html( title.html().replace(reg,'<font style="color:$1">$9</font>') );
					reg = /[^a-z0-9]+/g;
					url = url.trim().replace(reg,'-');
					reg = /(\/topic\/\d*\/)(.*)/;
					if (title.attr('href') != undefined) {
						title.attr( 'href', title.attr('href').replace(reg,'$1'+url) );
					} else {
						title.parent('a').attr( 'href', title.parent('a').attr('href').replace(reg,'$1'+url) );
					}
				} 		
			} else {
				if (title.html().match(reg)) {
					var url = title.html().replace(reg,'$9').toLowerCase();
					title.html( title.html().replace(reg,'$9') );
					reg = /[^a-z0-9]+/g;
					url = url.trim().replace(reg,'-');
					reg = /(\/topic\/\d*\/)(.*)/;
					if (title.attr('href') != undefined) {
						title.attr( 'href', title.attr('href').replace(reg,'$1'+url) );
					} else {
						title.parent('a').attr( 'href', title.parent('a').attr('href').replace(reg,'$1'+url) );
					}
				}
			}
		});
		//Change topic title on topic
		$('h3 p.topic-title').each(function() {
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
		//Change Breadcrump & header information
		$('ol.breadcrumb li.active span, .header-topic-title span').each(function() {
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