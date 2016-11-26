(function () {
    'use strict';
    angular
        .module('mainApp')
        .controller('ProfileController', ProfileController);

        ProfileController.$inject = ['$scope', '$rootScope','$location','$cookies', 'FlashService', 'AuthenticationService', 'EventService'];
            function ProfileController($scope, $rootScope, $location, $cookies, FlashService, AuthenticationService, EventService) {

                $("#bodyBackground").css('background', 'white');

                $scope.tab = 1;

                $scope.isEdit = false;
                $scope.change_password = false;

                $scope.user={};

                
                if ($rootScope.globals.currentUser.city == "null") {
                    $rootScope.globals.currentUser.city = "mars";
                }
                if ($rootScope.globals.currentUser.aboutme == "null") {
                    $rootScope.globals.currentUser.aboutme = "Hi, my name is " + $scope.username;
                }

                //$scope.aboutme = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante."


                $scope.SaveProfile = function() {

                    var mydata = $.param({
                        newname: $rootScope.globals.currentUser.username
                    });
                    $.ajax({
                        type: "POST",
                        url: 'https://yakume.xyz/api/changeusername',
                        data: mydata,
                        success: function(response){
                            if (response == "SUCCESS") {
                                console.log("saved to watchlist");
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
                                    console.log("saved to watchlist");
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
                    var mydata = $.param({
                    });

                     $.ajax({
                        type: "GET",
                        url: 'https://yakume.xyz/api/user/followees',
                        data: mydata,
                        success: function(response){
                            $scope.followees = JSON.parse(response).followee;
                            if ($scope.followees.length != 0) {
				                $scope.emptyfollowees = false;
                            }
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
                                
                                EventService.pull_user_by_email(news.email, callback_function);
                                
                                callback_function = callback_generator_event(news);
                                
                                EventService.pull_event_by_ID(news.event, callback_function);
                            }

                            for (id in $scope.reservenews) {
                                news = $scope.reservenews[id];
                                news.order = id;
                                news.timeshow = EventService.timeConverter(news.time);
                                
                                callback_function = callback_generator_user(news);
                                
                                EventService.pull_user_by_email(news.email, callback_function);
                                
                                callback_function = callback_generator_event(news);
                                
                                EventService.pull_event_by_ID(news.event, callback_function);
                            }
                        }
                    });
                }
                $scope.getfollowee();
                $scope.pull_newsfeed();


        }

    })();
