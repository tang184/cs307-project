(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('UpfileController', UpfileController);

        UpfileController.$inject = ['$scope', '$location','$cookies', 'FlashService', 'AuthenticationService'];
            function UpfileController($scope, $location, $cookies, FlashService, AuthenticationService) {

                $("#bodyBackground").css('background', 'white');

                



        }

})();
