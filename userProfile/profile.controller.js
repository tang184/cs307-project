(function () {
    'use strict';
    angular
        .module('mainApp')
        .controller('ProfileController', ProfileController);

        ProfileController.$inject = ['$scope', '$rootScope','$location','$cookies', 'FlashService', 'AuthenticationService', 'EventService', 'ngDialog'];
            function ProfileController($scope, $rootScope, $location, $cookies, FlashService, AuthenticationService, EventService, ngDialog) {

                $("#bodyBackground").css('background', 'white');

                $scope.tab = 1;

                $scope.isEdit = false;
                $scope.change_password = false;

                $scope.user={};
                
                $scope.SaveProfile = function() {
                    var mydata = $.param({
                        name: $rootScope.globals.currentUser.username,
                        city: $rootScope.globals.currentUser.city,
                        description: $rootScope.globals.currentUser.aboutme
                    });
                    $.ajax({
                        type: "POST",
                        url: 'https://yakume.xyz/api/userprofile/update',
                        data: mydata,
                        success: function(response){
                            if (response == "SUCCESS") {
								
                            } else if (response == "ERR_NOT_LOGGED_IN"){
                                alert("login expired, please login again");
                                $location.path('/login');
                            } else {
                                alert(response);
                            }
                        }
                    });
                    if ($rootScope.globals.currentUser.avatar) {
                        var postimage = $.param({
                            filename: $rootScope.globals.currentUser.avatar
                        });
                        $.ajax({
                            type: "POST",
                            url: 'https://yakume.xyz/api/avatar/update',
                            data: postimage,
                            success: function(response){
                                if (response == "SUCCESS") {
									
                                } else if (response == "ERR_NOT_LOGGED_IN"){
                                    alert("login expired, please login again");
                                    $location.path('/login');
                                } else {
                                    alert(response);
                                }
                            }
                        });
                    }
                    $scope.isEdit = false;
                }

                $scope.cancelProfile= function() {
                    $scope.isEdit = false;
                }

                $scope.uploadnewpass = function() {
                    var mydata = $.param({
                        password: $scope.newpassword
                    });
                    $.ajax({
                        type: "POST",
                        url: 'https://yakume.xyz/api/changepassword',
                        data: mydata,
                        success: function(response){


                            if (response == "SUCCESS") {
                                $scope.updatePassword();
                            } else if (response == "ERR_NOT_LOGGED_IN"){
                                alert("login expired, please login again");
                                $location.path('/login');
                            } else {
                                alert(response);
                            }
                        }
                    });
                }
				$scope.allevents_attend = [];
                $scope.updateevents_attend = function(eventlist) {
                    if ($scope.mymax > 5) {
                        $scope.mymax = 5;
                    }
                    for (var i = 0; i < $scope.mymax; i++) {
                        eventlist[i].starttime = EventService.timeConverter(eventlist[i].time);
                        if (eventlist[i].images.length == 0) {
                            eventlist[i].eventimage = "assets/image-resources/stock-images/img-17.jpg";
                        } else {
                            eventlist[i].eventimage = "https://yakume.xyz/img/" + eventlist[i].images[0];
                        }
                        $scope.allevents_attend.push(eventlist[i]);
                    }
					console.log($scope.allevents_attend);
                    $scope.$apply();             
                }

                $scope.trc = function(callback) {
                    $.ajax({
                        type: "GET",
                        url: 'https://yakume.xyz/api/myevents',
                        success: function(response){
                            console.log(response);
                            var events_attend_num = JSON.parse(response).events;
                            $rootScope.globals.event_attend = [];
                            var count = 0;
                            $.each(events_attend_num, function (i, item) {
                                var mydata = $.param({
                                    eventid : item
                                });
                                $.ajax({
                                    type: "GET",
                                    url: 'https://yakume.xyz/api/getevent',
                                    data: mydata,
                                    success: function(response){
                                        //console.log(response);
                                        if (response) {
                                            count++;
                                        //console.log(count);
                                        }
                                        $scope.mymax = events_attend_num.length;
                                        var t = JSON.parse(response);
                                        $rootScope.globals.event_attend.push(t);
                                        if (count == events_attend_num.length) {
                                            //console.log($rootScope.globals.event_attend);
                                            callback();
                                        }
                                    }
                                });
                            })
                        }
                    });
                }

				$scope.pull_myevent = function() {
					$scope.trc(function(){
						$scope.events_attend = $rootScope.globals.event_attend;

						$scope.sortbytime_attend();
					});
				}
                $scope.pull_myevent();

                $scope.sortbytime_attend = function() {
                    $scope.events_attend.sort(function(a,b){
                      return parseInt(a.time) - parseInt(b.time);
                    });
                    var currtime = new Date().getTime();
                    var len = $scope.events_attend.length;
                    var cnt = 0;
                    var index = 0;
                    while(cnt < len){
                        if($scope.events_attend[cnt].time >= currtime){
                            break;
                        }
                        cnt++;
                    }
                    while(index < cnt){
                        var temp = $scope.events_attend.shift();
                        $scope.events_attend.push(temp);
                        index++;
                    }
                    $scope.updateevents_attend($scope.events_attend);
                }



                $("#file").change(function () {
                    filePreview(this);
                });

                function filePreview(input) {
                    if (input.files && input.files[0]) {
                        var formData = new FormData();
                        if (input.files[0].type == "image/png") {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                $('#uploadForm + img').remove();
                                $('#uploadForm').after('<img src="'+e.target.result+'" width="150" height="100"/>');
                                /*$scope.uploadimage = {
                                    uploaded_file: e.target.result
                                }*/
                                formData.append('uploaded_file', $('input[type=file]')[0].files[0]);
                                $.ajax({
                                    type: "POST",
                                    url: 'https://yakume.xyz/img/upload_png',
                                    data: formData,
                                    contentType: false,
                                    processData: false,
                                    success: function(response) {

                                        $rootScope.globals.currentUser.avatar = response;

                                    }
                                });

                            }
                            reader.readAsDataURL(input.files[0]);
                        } else if (input.files[0].type == "image/jpeg"){
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                $('#uploadForm + img').remove();
                                $('#uploadForm').after('<img src="'+e.target.result+'" width="150" height="100"/>');
                                /*$scope.uploadimage = {
                                    uploaded_file: e.target.result
                                }*/
                                formData.append('uploaded_file', $('input[type=file]')[0].files[0]);
                                $.ajax({
                                    type: "POST",
                                    url: 'https://yakume.xyz/img/upload_jpg',
                                    data: formData,
                                    contentType: false,
                                    processData: false,
                                    success: function(response){


                                        $rootScope.globals.currentUser.avatar = response;

                                    }
                                });
                            }
                            reader.readAsDataURL(input.files[0]);
                        }                        
                    }
                }

                $scope.editProfile = function() {
                    $scope.isEdit = true;
                }
                $scope.changePassword = function() {
                    $scope.newpassword = "";
                    $scope.c_password = "";
                    $scope.oldpassword = "";
                    $scope.change_password = true;
                }
                $scope.updatePassword = function() {
                    $scope.change_password = false;
                }

                $scope.confirmPassword = false;
                $scope.sameAsOldPassword = false;
                $scope.emptyfollowees = true;
                $scope.emptyfollowers = true;

                $scope.checkPassword = function() {
                    if ($scope.oldpassword == $scope.newpassword) {
                        $scope.sameAsOldPassword = true;
                    } else {
                        $scope.sameAsOldPassword = false;
                    }
                    if ($scope.newpassword == $scope.c_password) {
                        $scope.confirmPassword = true;
                    } else {
                        $scope.confirmPassword = false;
                    }
                }

                $scope.getfollowee = function() {
                    EventService.pull_followee_list(function (email_list) {
						if (email_list.length == 0) {
							$scope.emptyfollowees = true;
							$scope.$apply();
						}
						else {
							$scope.emptyfollowees = false;
							EventService.pull_user_by_email_then_avatar_list(email_list, function(user_list) {
								$scope.followee_list = user_list;
								$scope.$apply();
							});
						}
					});
                }

                $scope.getfollower = function() {
                    EventService.pull_follower_list(function (email_list) {
						if (email_list.length == 0) {
							$scope.emptyfollowers = true;
							$scope.$apply();
						}
						else {
							$scope.emptyfollowers = false;
							EventService.pull_user_by_email_then_avatar_list(email_list, function(user_list) {
								$scope.follower_list = user_list;
								$scope.$apply();
							});
						}
					});
                }

                $scope.pull_newsfeed = function() {
                    var mydata = $.param({
                    });

                    $.ajax({
                        type: "GET",
                        url: 'https://yakume.xyz/api/newsfeed',
                        data: mydata,
                        success: function(response){
                            //console.log(response);
                            $scope.newsfeed = JSON.parse(response).newsfeed;

                            $scope.createnews = [];
                            $scope.reservenews = [];
                            $.each($scope.newsfeed, function (i, item) {
                                if (item.action == "created") {
                                    $scope.createnews.push(item);
                                } else {
                                    $scope.reservenews.push(item);
                                }
                            });

                            $scope.createnews.sort(function(a, b){return a.time - b.time});
                            $scope.reservenews.sort(function(a, b){return a.time - b.time});

                            var id;
                            var news;
                            var rest = $scope.newsfeed.length * 2;
                            
                            var callback_generator_user = function(outside_news) {
                                var inside_news = outside_news;
                                return function(profile) {
                                    inside_news.user = profile;
                                    rest = rest - 1;
                                    if (rest == 0) {
                                        $scope.$apply();
                                    }
                                };
                            };
                            var callback_generator_event = function(outside_news) {
                                var inside_news = outside_news;
                                return function(anevent) {
                                    inside_news.anevent = anevent;
                                    rest = rest - 1;
                                    if (rest == 0) {
                                        $scope.$apply();
                                    }
                                };
                            };
                            var callback_function;
                            
                            for (id in $scope.createnews) {
                                news = $scope.createnews[id];
                                news.order = id;
                                news.timeshow = EventService.timeConverter(news.time);
                                
                                callback_function = callback_generator_user(news);
                                
                                EventService.pull_user_by_email_then_avatar(news.email, callback_function);
                                
                                callback_function = callback_generator_event(news);
                                
                                EventService.pull_event_by_ID(news.event, callback_function);
                            }

                            for (id in $scope.reservenews) {
                                news = $scope.reservenews[id];
                                news.order = id;
                                news.timeshow = EventService.timeConverter(news.time);
                                
                                callback_function = callback_generator_user(news);
                                
                                EventService.pull_user_by_email_then_avatar(news.email, callback_function);
                                
                                callback_function = callback_generator_event(news);
                                
                                EventService.pull_event_by_ID(news.event, callback_function);
                            }
                        }
                    });
                }
				$scope.goto_profie = function(email) {
					$location.path("/main/profileothers/" + email);
				}
				$scope.showspecificevent = function(id) {
					EventService.showspecificevent($scope, $rootScope, $location, ngDialog, id);
				}
                $scope.getfollowee();
                $scope.getfollower();
                $scope.pull_newsfeed();
        }

    })();
