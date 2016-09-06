(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$location', 'FlashService'];
        function DashboardController($scope, $location, FlashService) {
            
            $("#bodyBackground").css('background', 'white');

        };


})();