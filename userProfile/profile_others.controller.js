(function () {
    'use strict';
    angular
        .module('mainApp')
        .controller('ProfileOthersController', ProfileOthersController);

    ProfileOthersController.$inject = ['$scope', '$rootScope','$location','$cookies', 'FlashService', 'AuthenticationService', 'EventService'];
    function ProfileOthersController($scope, $rootScope, $location, $cookies, FlashService, AuthenticationService, EventService) {
		console.log("Profile Controller Init.");
		$scope.update = function() {
			EventService.pull_user_by_email_from_url(function (user) {
				console.log(user);
				$scope.user = user;
				$scope.$apply();
			});
			
		}
		$scope.update();

	}

})();