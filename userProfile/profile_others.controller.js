(function () {
    'use strict';
    angular
        .module('mainApp')
        .controller('ProfileOthersController', ProfileOthersController);

    ProfileOthersController.$inject = ['$scope', '$rootScope','$location','$cookies', 'FlashService', 'AuthenticationService', 'EventService'];
    function ProfileOthersController($scope, $rootScope, $location, $cookies, FlashService, AuthenticationService, EventService) {
		console.log("Profile Controller Init.");
		$scope.you_follow = false;
		$scope.follow_you = false;
		
		$scope.update = function() {
			EventService.pull_user_by_email_from_url(function (user) {
				console.log(user);
				$scope.user = user;
				$scope.get_follow();
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
		$scope.update();

	}

})();