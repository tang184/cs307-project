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

                $scope.username = AuthenticationService.selfprofile.name

                $scope.email = AuthenticationService.selfprofile.email

		console.log(AuthenticationService.selfprofile);

                $scope.city = "";

                $scope.aboutme = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante."

                $scope.print = function() {
                    console.log($scope.aboutme);
                }





        }

    })();
