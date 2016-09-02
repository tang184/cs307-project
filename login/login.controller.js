(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$location'];
    	function LoginController($scope, $location) {
        	$("#bodyBackground").css('background-image', 'url(../assets/image-resources/blurred-bg/blurred-bg-3.jpg)');

        	$scope.register = function() {
        		$location.path('/register');
        	}
    	};


})();




