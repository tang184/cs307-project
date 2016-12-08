(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('SearchuserController', SearchuserController);

    SearchuserController.$inject = ['$scope','$rootScope', '$location', 'FlashService', 'ngDialog', 'EventService'];
        function SearchuserController($scope, $rootScope ,$location, FlashService, ngDialog, EventService) {

            $scope.search = function() {
                var mydata = $.param({
                    name : $scope.key
                });
				
                $.ajax({
                    type: "GET",
                    url: 'https://yakume.xyz/api/searchuser',
                    data: mydata,
                    success: function(response){
						var userlist = JSON.parse(response).users;
						if (userlist.length == 0) {
							$scope.users = false;
							$scope.show_result = true;
							$scope.$apply();
						}
						else {
							var i;
							var email_list = [];
							for (i in userlist) {
								email_list.push(userlist[i].email);
							}
							EventService.pull_user_by_email_then_avatar_list(email_list, function(users) {
								$scope.users = users;
								$scope.show_result = true;
								$scope.$apply();
							});
						}
                    }
                });
            };
			
			$scope.goto_profie = function(email) {
				$location.path("/main/profileothers/" + email);
			};
			
			$scope.users = false;
			$scope.show_result = false;
			// $scope.$apply();
        };




})();
