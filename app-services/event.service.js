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
		
		service.pull_user_by_email = pull_user_by_email;
		service.pull_user_by_email_then_avatar = pull_user_by_email_then_avatar;
		service.pull_user_by_email_then_avatar_list = pull_user_by_email_then_avatar_list;
		service.pull_event_by_ID = pull_event_by_ID;
		service.pull_event_by_ID_list = pull_event_by_ID_list
		service.pack_event_list = pack_event_list
		
		service.pull_followee_list = pull_followee_list;
		service.pull_follower_list = pull_follower_list;
		service.pull_rating_from_email = pull_rating_from_email;
		service.change_rating = change_rating;
		service.showspecificevent = showspecificevent;
		
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
		
        function pull_user_by_email_then_avatar_list(list, callback) {
			var users = [];
			var rest = list.length;
			var id;
			
			for (id in list) {
				pull_user_by_email_then_avatar(list[id], function(user) {
					users.push(user);
					rest = rest - 1;
					if (rest == 0) {
						callback(users);
					}
				});
			}
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
						anevent.starttime = timeConverter(anevent.time);
						if (anevent.images.length == 0) {
							anevent.eventimage = "assets/image-resources/stock-images/img-17.jpg";
						}
						else {
							anevent.eventimage = "https://yakume.xyz/img/" + anevent.images[0];
						}
					}
					catch(err) {
						console.log("ID:" + id + " with " + response);
					}
                    callback(anevent);
                }
            });
        }
		
        function pull_event_by_ID_list(list, callback) {
			var events = [];
			var rest = list.length;
			var id;
			
			var position_keeper = function(position) {
				var internal_position = position;
				return function(event) {
					event.origianl_position = internal_position;
					events.push(event);
					rest = rest - 1;
					if (rest == 0) {
						events.sort(function(a, b) {
							return a.origianl_position - b.origianl_position;
						});
						callback(events);
					}
				}
			}
			
			for (id in list) {
				pull_event_by_ID(list[id], position_keeper(id));
			}
        }
		
        function pack_event_list(list) {
			var list_object = {};
			list_object.list = list;
			
			list_object.MAXEVENTPERPAGE = 8;
			list_object.currentpage = 1;
			list_object.maxpage = Math.ceil(list_object.list.length / list_object.MAXEVENTPERPAGE);
			
			list_object.change_page = function(x) {
				list_object.currentpage = list_object.currentpage + x;
				if (list_object.currentpage > list_object.maxpage) {
					list_object.currentpage = list_object.maxpage;
				}
				if (list_object.currentpage < 1) {
					list_object.currentpage = 1;
				}
				
                list_object.startpos = (list_object.currentpage - 1) * list_object.MAXEVENTPERPAGE;
                list_object.endpos = (list_object.currentpage) * list_object.MAXEVENTPERPAGE;
                if (list_object.endpos > list_object.list.length) {
                    list_object.endpos = list_object.list.length;
				}
				list_object.showing = list_object.list.slice(list_object.startpos, list_object.endpos);
			}
			
			list_object.fix_time_after_sort = function() {
				var currtime = new Date().getTime();
                var len = list_object.list.length;
                var cnt = 0;
                var index = 0;
                while(cnt < len){
                    if(list_object.list[cnt].time >= currtime){
                        break;
                    }
                    cnt ++;
                }
                while(index < cnt){
                    var temp = list_object.list.shift();
                    list_object.list.push(temp);
                    index++;
                }
			}
			
			list_object.sort_by_time = function(fix_time) {
                list_object.list.sort(function(a,b) {
                  return parseInt(a.time) - parseInt(b.time);
                });
				if (fix_time) {
					list_object.fix_time_after_sort();
				}
				list_object.change_page(0);
            }

            list_object.sort_by_name = function(fix_time) {
                list_object.list.sort(function(a,b) {
                    return a.title.localeCompare(b.title);
                });
				if (fix_time) {
					list_object.fix_time_after_sort();
				}
				list_object.change_page(0);
            }

            list_object.sort_by_publish = function(fix_time) {
				list_object.list.sort(function(a,b) {
                  return parseInt(a.timeposted) - parseInt(b.timeposted);
				});
				if (fix_time) {
					list_object.fix_time_after_sort();
				}
				list_object.change_page(0);
            }
			
			list_object.change_page(0);
			
			return list_object;
        }
		
        function pull_followee_list(callback) {
            var mydata = $.param({
            });

            $.ajax({
                type: "GET",
                url: 'https://yakume.xyz/api/user/followees',
                data: mydata,
                success: function(response){
                    var list = response;
					try {
						list = JSON.parse(response);
					}
					catch(err) {
						console.log("unable to pull followee list with response: " + response);
					}
                    callback(list.followee);
                }
            });
        }

        function pull_follower_list(callback) {
            var mydata = $.param({
            });

            $.ajax({
                type: "GET",
                url: 'https://yakume.xyz/api/user/followers',
                data: mydata,
                success: function(response){
                    var list = response;
					try {
						list = JSON.parse(response);
					}
					catch(err) {
						console.log("unable to pull follower list with response: " + response);
					}
                    callback(list.follower);
                }
            });
        }

		function DetailTimeConverter(UNIX_timestamp) {
			var a = new Date(UNIX_timestamp);
			var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
			var year = a.getFullYear();
			var month = months[a.getMonth()];
			var date = a.getDate();
			var hour = a.getHours();
			var minute = a.getMinutes();
			var time = month + ' ' + date + ' ' +  year + '   ' + hour + ':' + minute;
			return time;
		}
		
		function pull_rating_from_email(email, callback) {
			var mydata = $.param({
                user: email
            });

            $.ajax({
                type: "GET",
                url: 'https://yakume.xyz/api/rating/get',
                data: mydata,
                success: function(response){
					var rating_data = {};
					rating_data.rating = response;
					rating_data.stars = [];
					rating_data.star_num = Math.round(response);
					console.log(response);
					
					var i = 0;
					var star;
					
					while (i < 5) {
						star = {};
						star.id = i;
						if (i < rating_data.star_num) {
							star.image_src = "star_1.png";
						}
						else {
							star.image_src = "star_0.png";
						}
						i = i + 1;
						rating_data.stars.push(star);
					}
					
                    callback(rating_data);
                }
            });
		}
		
		function change_rating(email, rating, callback) {
			var mydata = $.param({
				user: email,
				rating: rating
            });

            $.ajax({
                type: "POST",
                url: 'https://yakume.xyz/api/rating/rate',
                data: mydata,
                success: function(response){
					callback && callback(response);
                }
            });
		}
		
		function showspecificevent($scope, $rootScope, $location, ngDialog, id) {
			var event;
			pull_event_by_ID(id, function(specevent) {
				$scope.specevent = specevent;
				$scope.specevent.mapurl="img/loc_404.png";

				$scope.abc = "owner";
				$scope.specevent.starttime = DetailTimeConverter($scope.specevent.time);
				$scope.specevent.endtime = DetailTimeConverter($scope.specevent.time + $scope.specevent.duration);
				$scope.specevent.posttime = DetailTimeConverter($scope.specevent.timeposted);

				if ($scope.specevent.latitude) {
					$scope.specevent.mapurl="https://maps.googleapis.com/maps/api/staticmap?center=" + $scope.specevent.latitude + "," + $scope.specevent.longitude +
						"&zoom=16&size=320x200&&markers=color:red%7Clabel:C%7C" + $scope.specevent.latitude + "," + $scope.specevent.longitude
						+ "&key=AIzaSyAFhzO5tGWXiCCtH5y6XW6ycS-1fbC4uYA";
					console.log($scope.specevent.mapurl);
				}
				else {
					$scope.specevent.mapurl="img/loc_404.png";
				}
				event = $scope.specevent;
				ngDialog.open({
					template: 'templateId', controller: ['$scope', '$cookies' , function($scope, $cookies) {
						$scope.specevent = event;
						$scope.popDialog = ngDialog;

						// pull user.
						pull_user_by_email_then_avatar($scope.specevent.owner, function(user) {
							$scope.specevent.owner_object = user;
							$scope.$apply();
						});
						
						$scope.selfown = false;
						$scope.save = true;
						//$scope.reserve = true;
						if ($rootScope.globals.currentUser.email == $scope.specevent.owner) {
							$scope.selfown = true;
						}
						$scope.sattend = false;
						$scope.payment = false;
						
						if ($scope.specevent.price != 0) {
							$scope.payment = true;
						}
						$scope.past = ((new Date().getTime()) > (event.time));
						
						var mydata = $.param({
							eventid : event.id
						});

					    $scope.closeDialog = function() {
							$scope.popDialog.close();
					    }
						$scope.updateattendees = function() {
							$.ajax({
								type: "GET",
								url: 'https://yakume.xyz/api/attendees',
								data: mydata,
								success: function(response) {
									$scope.attendees = JSON.parse(response).attendees;
									$scope.reserve = !($.inArray($rootScope.globals.currentUser.email, $scope.attendees) > -1);
									$scope.getattendees();
								}
							});
						}
						$scope.updateattendees();
						$scope.getattendees = function() {
							pull_user_by_email_then_avatar_list($scope.attendees, function(list) {
								$scope.attend_users = list;
								$scope.$apply();
							});
						}
						$scope.ownerprofie = function() {
							$location.path("/main/profileothers/" + $scope.specevent.owner);
						    $scope.popDialog.close();
						}
						$scope.goto_profie = function(email) {
							$location.path("/main/profileothers/" + email);
						    $scope.popDialog.close();
						}
						$scope.showattend = function() {
							$scope.sattend = !$scope.sattend;
						}
						$scope.saveEvent = function(id) {
							$scope.save = false;
							var mydata = $.param({
								eventid : id
							});

							$.ajax({
								type: "POST",
								url: 'https://yakume.xyz/api/watchlist/save',
								data: mydata,
								success: function(response){

									if (response == "SUCCESS") {
										console.log("saved to watchlist!");
									} else if (response == "ERR_NOT_LOGGED_IN"){
										alert("login expired, please login again");
										$location.path('/login');
									} else {
										alert(response);
									}

								}
							});
						}

						$scope.unsaveEvent = function(id) {
							$scope.save = true;
							var mydata = $.param({
								eventid : id
							});

							$.ajax({
								type: "POST",
								url: 'https://yakume.xyz/api/watchlist/delete',
								data: mydata,
								success: function(response){

									if (response == "SUCCESS") {
										console.log("unsaved from watchlist!");
									} else if (response == "ERR_NOT_LOGGED_IN"){
										alert("login expired, please login again");
										$location.path('/login');
									} else {
										alert(response);
									}



								}
							});
						}
						$scope.showpayinfo = false;
						$scope.reserveEvent = function(id) {
							if ($scope.payment) {
								if ($scope.showpayinfo) {
									var mydata = $.param({
										amount : $scope.specevent.price,
										card : $scope.cardnumber,
										exp_mm : $scope.expmonth,
										exp_yy : $scope.expyear
									});
									$.ajax({
										type: "POST",
										url: 'https://yakume.xyz/api/pay',
										data: mydata,
										success: function(response){
											if (response == "ERR_NOT_LOGGED_IN") {
												alert("login expired, please login again");
												$location.path('/login');
											} else {
												var mydatareserve = $.param({
													eventid : id,
													payment_token : response
												});
												$.ajax({
													type: "POST",
													url: 'https://yakume.xyz/api/event/register',
													data: mydatareserve,
													success: function(response){
														if (response == "SUCCESS") {
															$scope.updateattendees();
														} else if (response == "ERR_INVALID_ARGUMENT") {
															alert("You haven't pay");
														} else if (response == "ERR_NOT_LOGGED_IN") {
															alert("login expired, please login again");
															$location.path('/login'); 
														} else {
															alert(response);
														}
														console.log($scope.attendees);
													}
												});
											}
										}
									});
								} else {
									$scope.showpayinfo = true;
								}
							}  else {
								$scope.reserve = false;
								$scope.showpayinfo = false;
								var mydata = $.param({
									eventid : id
								});

								$.ajax({
									type: "POST",
									url: 'https://yakume.xyz/api/event/register',
									data: mydata,
									success: function(response){
										if (response == "SUCCESS") {
											$scope.updateattendees();
										} else if (response == "ERR_INVALID_ARGUMENT") {
											alert("You haven't pay");
										} else if (response == "ERR_NOT_LOGGED_IN") {
											alert("login expired, please login again");
											$location.path('/login'); 
										} else {
											alert(response);
										}
										console.log($scope.attendees);
									}
								});
							}
							
						}

						$scope.quitEvent = function(id) {
							$scope.reserve = true;
							var mydata = $.param({
								eventid : id
							});

							$.ajax({
								type: "POST",
								url: 'https://yakume.xyz/api/event/unregister',
								data: mydata,
								success: function(response){

									
									if (response == "SUCCESS") {
										$scope.updateattendees();
									} else if (response == "ERR_NOT_LOGGED_IN"){
										alert("login expired, please login again");
										$location.path('/login');
									} else {
										alert(response);
									}


								}
							});
						}

						$scope.Follow = function() {
							$scope.follow = true;
							var mydata = $.param({
								email : $scope.specevent.owner
							});
							$.ajax({
								type: "POST",
								url: 'https://yakume.xyz/api/user/follow',
								data: mydata,
								success: function(response){
									if (response == "SUCCESS") {
										console.log(response);
									} else if (response == "ERR_NOT_LOGGED_IN"){
										alert("login expired, please login again");
										$location.path('/login');
									} else {
										alert(response);
									}
								}
							});
						}

						$scope.unFollow = function() {
							$scope.follow = false;
							var mydata = $.param({
								email : $scope.specevent.owner
							});

							$.ajax({
								type: "POST",
								url: 'https://yakume.xyz/api/user/unfollow',
								data: mydata,
								success: function(response){

									if (response == "SUCCESS") {
										console.log(response);
									} else if (response == "ERR_NOT_LOGGED_IN"){
										alert("login expired, please login again");
										$location.path('/login');
									} else {
										alert(response);
									}

								}
							});
						}

						$scope.deleteEvent = function(id) {
							var mydata = $.param({
								eventid : id
							});

							$.ajax({
								type: "POST",
								url: 'https://yakume.xyz/api/deleteevent',
								data: mydata,
								success: function(response){

									if (response == "SUCCESS") {
										console.log(response);
									} else if (response == "ERR_NOT_LOGGED_IN"){
										alert("login expired, please login again");
										$location.path('/login');
									} else {
										alert(response);
									}

								}
							});
						    popDialog.close();
						}
					}]
                });
            })
        }

		
    }
	
})();
