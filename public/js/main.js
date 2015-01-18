(function() {
	"use strict";

	//Define the variables.
	var allowedGroups = getAllowedGroups(),
	allGroups = getAllGroups(),
	colorRegex = /%\((#(?:[A-Fa-f0-9]{3}(?:[A-Fa-f0-9]{3})?)|(?:rgb\(\d{1,3},\d{1,3},\d{1,3}\))|(?:[a-z]){3,})\)\[(.+?)\]/g,
	urlRegex = /(\/topic\/\d*\/).*/,
	//topic header navigation, breadcrumb, document title
	staticTitles = '.header-topic-title span, ol.breadcrumb li.active span, title, #title';
	function colorTitles (tid, pid) {
		//title on : homepage, category, topic(lavender), topic(vanilla), search, recent topics widget
		if ( tid !== 'undefined' ) return '.post-preview-content a[href^="/topic/'+tid+'/"], .category-item a[href^="/topic/'+tid+'/"].topic-title, .category-item a[href^="/topic/'+tid+'/"] .topic-title, .topic-item #topic_title_'+pid+' , a[href^="/topic/'+tid+'/"].search-result-text, #recent_topics a[href^="/topic/'+tid+'/"]';
	}
	$(document).ready(function(){
		$('.notifications').on('click',function () {
			var watchNotifications = setInterval(function () {
				if (!$('#notif-list .fa-spin')) {
					clearInterval(watchNotifications);
					$('#notif-list .text').each(function(){
						colorifyTopic($(this),false);
					});
				}

			},20)
		});
        var nextStart = $('#topics-container').data('nextstart');
	});
	$(window).on({
		'action:ajaxify.end': filterTopic,
		'action:widgets.loaded': filterWidget
	});
    var maxTopics = $(window).one('action:categories.loading', nextStart);
    $(window).on('action:categories.loaded', function(){
        pageLoaded(maxTopics);
    });
	socket.on('event:post_edited', filterEditedTopic);

	function getAllowedGroups() {
		$.getJSON(RELATIVE_PATH + '/api/plugins/topic-color', function (data) {
			allowedGroups = data.allowedGroups
		});
	}
   	function getAllGroups() {
		$.getJSON(RELATIVE_PATH + '/api/groups', function (data) {
			allGroups = data.groups
		});
	}
    function nextStart() {
        maxTopics = $('#topics-container').attr('data-nextstart');
        return maxTopics;
    }
    function pageLoaded(maxTopics) {
        var page = $('#topics-container').attr('data-nextstart') / maxTopics;
        colorifyTopic(staticTitles,false);
        $.getJSON(RELATIVE_PATH + '/api/' + ajaxify.currentPage + '?page=' + page, traverse);
    }
	function filterTopic() {
		colorifyTopic(staticTitles,false);
		$.getJSON(RELATIVE_PATH + '/api/' + ajaxify.currentPage, traverse);
		if (window.location.pathname.match(urlRegex)) {
			filterHeader();
		}
	}
	function filterWidget() {
        setTimeout(function () {
            $('#recent_topics li').each(function(){
                var topic = {
                    username: $(this).find('a[href^="/user/"]').attr('href').match(/\/user\/(.+)/)[1],
                    tid: $(this).find('a[href^="/topic/"]').attr('href').match(/\/topic\/(.+)\//)[1]
                }
                isInAllowedGroups(topic);
            });
        },300);
	}
	function filterHeader() {
		var header = staticTitles.split(',',1);
		$(window).scroll( function(){ colorifyTopic(header[0], false); });
	}
	function filterEditedTopic() {
		setTimeout(filterTopic, 270);
	}
	function traverse(obj) {
		if (obj && obj.hasOwnProperty('title')) {
			isInAllowedGroups(obj);
		}
		for (var prop in obj) {
			if (typeof(obj[prop]) === 'object') traverse(obj[prop]);
        }
	}
	function isInAllowedGroups(topic) {
		var allowed = false;
		allGroups.some( function(group) {
			var isInGroup = group.members.some( function(member) {
				return ( member.uid === topic.uid || topic.username === member.username );
			});
			allowed = isInGroup && allowedGroups.indexOf(group.name) !== -1;
			return allowed
		});
		var tid = topic.tid,
		pid = topic.mainPid;
		colorifyTopic(colorTitles(tid, pid),allowed);
	}
	function colorifyTopic(title, allowed) {
		$(title).each(function(){

			if ($(this).html().match(colorRegex)) {	
				$(this).html( $(this).html().replace( colorRegex, allowed ? '<font style="color:$1">$2</font>' : '$2' ) );
			}
			
		});
	}
}());