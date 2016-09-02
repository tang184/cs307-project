(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$location', '$scope'];
        function RegisterController($location, $scope) {
            $("#bodyBackground").css('background-image', 'url(../assets/image-resources/blurred-bg/blurred-bg-2.jpg)');

            $scope.back = function() {
                $location.path('/');
            }
        }


})();
