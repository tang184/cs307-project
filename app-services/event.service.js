(function () {
    'use strict';

    angular
        .module('mainApp')
        .factory('EventService', EventService);
		
    EventService.$inject = ['$state', '$location'];
    function EventService($state, $location) {
        var service = {};
		
        service.pulleventfromID = pulleventfromID;
        service.pull_user_by_email_from_url = pull_user_by_email_from_url;
        service.pull_all_events = pull_all_events;
        service.maketexttime = maketexttime;
        service.tag_tostring = tag_tostring;
        service.timeConverter = timeConverter;
		
		service.pull_user_by_email_then_avatar = pull_user_by_email_then_avatar;
		service.pull_user_by_email = pull_user_by_email;
		service.pull_event_by_ID = pull_event_by_ID;
		
        return service;
		
        function pulleventfromID(callback) {
            var tempid = $state.params.eventid;
            if (!tempid) {
                tempid = 1;
            }

            var mydata = $.param({
                eventid: tempid
            });

            $.ajax({
                type: "GET",
                url: 'https://yakume.xyz/api/getevent',
                data: mydata,
                success: function(response){
                    var anevent = JSON.parse(response);
                    callback(anevent);
                }
            });
        }
		
        function pull_user_by_email_from_url(callback) {
            pull_user_by_email_then_avatar($state.params.profile_others_email, callback);
        }

        function pull_all_events(callback) {
            var mydata = $.param({
            });

            $.ajax({
                type: "GET",
                url: 'https://yakume.xyz/api/getevent',
                data: mydata,
                success: function(response){
                    var events = JSON.parse(response).events;
                    callback(events);
                }
            });
        }
		
        function maketexttime(anevent) {
            anevent.starttime_txt = timeConverter(anevent.time);
			anevent.endtime_txt = timeConverter(anevent.time + anevent.duration);
			anevent.posttime_txt = timeConverter(anevent.timeposted);
        }
		
        function tag_tostring(tags) {
			var i;
			var s = "";
			for (i = 0; i < tags.length; i ++) {
				s = s + tags[i];
				if (i < tags.length - 1) {
					s = s + " ";
				}
			}
			return s;
        }
		
		
        function timeConverter(UNIX_timestamp){
            var a = new Date(UNIX_timestamp);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
            return time;
        }
		
        function pull_user_by_email(email, callback) {
            var mydata = $.param({
                email: email
            });

            $.ajax({
                type: "GET",
                url: 'https://yakume.xyz/api/userprofile',
                data: mydata,
                success: function(response){
                    var profile = response;
					try {
						profile = JSON.parse(response);
					}
					catch(err) {
						console.log("email:" + email + " with " + response);
					}
                    callback(profile);
                }
            });
        }
		
        function pull_user_by_email_then_avatar(email, callback) {
            pull_user_by_email(email, function(user) {
				var mydata = $.param({
					email: user.email
				});

				$.ajax({
					type: "GET",
					url: 'https://yakume.xyz/api/avatar/get',
					data: mydata,
					success: function(response){
						user.avatar = response;
						callback(user);
					}
				});
			});
        }

        function pull_event_by_ID(id, callback) {
            var mydata = $.param({
                eventid: id
            });

            $.ajax({
                type: "GET",
                url: 'https://yakume.xyz/api/getevent',
                data: mydata,
                success: function(response){
                    var anevent = response;
					try {
						anevent = JSON.parse(response);
					}
					catch(err) {
						console.log("ID:" + id + " with " + response);
					}
                    callback(anevent);
                }
            });
        }
    }
	
})();