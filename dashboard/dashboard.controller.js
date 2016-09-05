(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$location', 'FlashService'];
        function DashboardController($scope, $location, FlashService) {
            
            $("#bodyBackground").css('background-image', 'url(assets/image-resources/blurred-bg/blurred-bg-3.jpg)');

        };


})();