(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('ProfileController', ProfileController);

        ProfileController.$inject = ['$scope', '$location', 'FlashService'];
            function ProfileController($scope, $location, FlashService) {

                $("#bodyBackground").css('background', 'white');

            };

        function ProfileController($scope) {
            $scope.panel1 = true;
            $scope.panel2 = false;

            $scope.toggle1 = function() {
                $scope.panel1 = true;
                $scope.panel2 = false;
            }

            $scope.toggle2 = function() {
                $scope.panel1 = false;
                $scope.panel2 = true;
            }

        }
})();
