(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', '$location', 'FlashService'];
        function ProfileController($scope, $location, FlashService) {
            
            $("#bodyBackground").css('background', 'white');

        };


})();