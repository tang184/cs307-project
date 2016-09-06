(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$location', 'FlashService'];
    	function LoginController($scope, $location, FlashService) {
    		
        	$("#bodyBackground").css('background-image', 'url(assets/image-resources/blurred-bg/blurred-bg-3.jpg)');

        	$scope.register = function() {
        		$location.path('/register');
        	}

        	$scope.login = function() {
        		var myVar = setInterval(FlashService.Success, 2000);
        		FlashService.Success('Login successful', true);
        		$location.path('/main/dashboard');
        	}
    	};


})();




