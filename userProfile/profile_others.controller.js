(function () {
    'use strict';
    angular
        .module('mainApp')
        .controller('ProfileOthersController', ProfileOthersController);

    ProfileOthersController.$inject = ['$scope', '$rootScope','$location','$cookies', 'FlashService', 'AuthenticationService', 'EventService', 'ngDialog'];
    function ProfileOthersController($scope, $rootScope, $location, $cookies, FlashService, AuthenticationService, EventService, ngDialog) {
		$scope.you_follow = false;
		$scope.follow_you = false;
		
		$scope.update = function() {
			EventService.pull_user_by_email_from_url(function (user) {
				console.log(user);
				$scope.user = user;
				$scope.get_follow();
				$scope.pull_timeline();
				$scope.get_rating();
				$scope.$apply();
			});
			
		}
		
		$scope.get_follow = function() {
			EventService.pull_followee_list(function (list) {
				$scope.you_follow = list.includes($scope.user.email);
				$scope.$apply();
			});
			EventService.pull_follower_list(function (list) {
				$scope.follow_you = list.includes($scope.user.email);
				$scope.$apply();
			});
		}
		
		$scope.change_follow = function() {
			var mydata = $.param({
				email: $scope.user.email
            });
			
			var change_url;
			if ($scope.you_follow) {
				change_url = 'https://yakume.xyz/api/user/unfollow';
			}
			else {
				change_url = 'https://yakume.xyz/api/user/follow';
			}

            $.ajax({
                type: "POST",
                url: change_url,
                data: mydata,
                success: function(response){
                    console.log(response);
                    $scope.get_follow();
                }
            });
		}

		$scope.get_rating = function() {
			EventService.pull_rating_from_email($scope.user.email, function (rating_data) {
				$scope.rating_data = rating_data;
				$scope.$apply();
			});
		}
		
		$scope.change_rating = function(rating) {
			console.log("Rate: " + (rating + 1).toString());
			EventService.change_rating($scope.user.email, rating + 1, function(response) {
				alert(response);
				$scope.get_rating();
			});
		}
		
		$scope.pull_timeline = function() {
			var mydata = $.param({
				email:$scope.user.email
			});

			$.ajax({
				type: "GET",
				url: 'https://yakume.xyz/api/timeline/user',
				data: mydata,
				success: function(response){
					//console.log(response);
					$scope.timeline = JSON.parse(response).timeline;

					$scope.createnews = [];
					$scope.reservenews = [];
					$.each($scope.timeline, function (i, item) {
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
					var rest = $scope.timeline.length * 2;
					
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
		
		$scope.update();

	}

})();