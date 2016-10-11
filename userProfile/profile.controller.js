(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('ProfileController', ProfileController);

        ProfileController.$inject = ['$scope', '$location', 'FlashService', 'AuthenticationService'];
            function ProfileController($scope, $location, FlashService, AuthenticationService) {

                $("#bodyBackground").css('background', 'white');

                $scope.tab = 1;

                $scope.isEdit = false;

                $scope.set_name = function(s, update) {
                    $scope.username = s;
                    if (update) {
                        $scope.$apply();
                    }
                }
                AuthenticationService.SetName($scope.set_name);

                $scope.email = AuthenticationService.GetEmail();

		console.log($scope.username);
		console.log($scope.email);

                $scope.city = "";

                $scope.aboutme = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante."

                $scope.print = function() {
                    console.log($scope.aboutme);
                }





        }

    })();
