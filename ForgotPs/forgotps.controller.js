(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('ForgetPasswordController', ForgetPasswordController);

    ForgetPasswordController.$inject = ['$scope', '$rootScope','$location', 'FlashService', 'AuthenticationService', '$state'];

	function ForgetPasswordController($scope, $rootScope, $location, FlashService, AuthenticationService, $state) {
    	$("#bodyBackground").css('background-image', 'url(assets/image-resources/blurred-bg/blurred-bg-7.jpg)');

    	$scope.submit = function() {
    		var mydata = $.param({
                email: $scope.email
            });
    		$.ajax({
                  type: "POST",
                  url: 'https://yakume.xyz/api/resetpassword',
                  data: mydata,
                  success: function(response, testStatus, request){
                  	if (response == "ERR_USER_NOT_FOUND") {
                  		var myVar = setInterval(FlashService.Error, 2000);
                        alert('Email not found', true);
                  	} else {
                  		var myVar = setInterval(FlashService.Success, 2000);
                        FlashService.Success('Password Reset', true);
                  	}
                  }	
            });
            $scope.back();

    	}
    	$scope.back = function() {
            $location.path('/login');
        }

    }
})();