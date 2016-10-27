(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('ForgetPasswordController', ForgetPasswordController);

    ForgetPasswordController.$inject = ['$scope', '$rootScope','$location', 'FlashService', 'AuthenticationService', '$state'];

	function ForgetPasswordController($scope, $rootScope, $location, FlashService, AuthenticationService, $state) {
    	$("#bodyBackground").css('background-image', 'url(assets/image-resources/blurred-bg/blurred-bg-7.jpg)');
    }
})();