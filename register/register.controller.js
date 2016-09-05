(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$location', '$scope'];
        function RegisterController($location, $scope) {
            $("#bodyBackground").css('background-image', 'url(assets/image-resources/blurred-bg/blurred-bg-2.jpg)');

            $scope.vm = {};
            $scope.confirmPassword = false;

            $scope.back = function() {
                $location.path('/');
            }

            $scope.submit = function(vm) {

            }


            $scope.checkPassword = function() {
                if ($scope.vm.user.password == $scope.c_password) {
                    $scope.confirmPassword = true;
                } else {
                    $scope.confirmPassword = false;
                }

            }
        }


})();
