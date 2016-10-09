(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('ProfileController', ProfileController);

        ProfileController.$inject = ['$scope', '$location', 'FlashService'];
            function ProfileController($scope, $location, FlashService) {

                $("#bodyBackground").css('background', 'white');

                $scope.tab = 1;

                $scope.isEdit = false;

                $scope.username = "Admin";

                $scope.email = "admin@yakume.xyz";

                $scope.city = "";

                $scope.aboutme = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante."

                $scope.print = function() {
                    console.log($scope.aboutme);
                }





        }

    })();
