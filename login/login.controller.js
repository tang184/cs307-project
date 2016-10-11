(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$rootScope','$location', 'FlashService', 'AuthenticationService', '$state'];

    	function LoginController($scope, $rootScope, $location, FlashService, AuthenticationService, $state) {
        	$("#bodyBackground").css('background-image', 'url(assets/image-resources/blurred-bg/blurred-bg-7.jpg)');
            /*function statusChangeCallback(response) {
                console.log('statusChangeCallback');
                console.log(response);
                if (response.status === 'connected') {
                  testAPI();
                } else if (response.status === 'not_authorized') {
                } else {
                  document.getElementById('status').innerHTML = 'Please log ' +
                    'into Facebook.';
                }
            }*/
            

              /*function testAPI() {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', function(response) {
                  console.log('Successful login for: ' + response.name);

                });
              }*/

            (function initController() {
            // reset login status
                AuthenticationService.ClearCredentials();
            })();

        	$scope.register = function() {
        		$location.path('/register');
        	}

        	$scope.login = function() {

                    AuthenticationService.Login($scope.username, $scope.password, function (response, request) {
                        if (response == "SUCCESS") {
                            AuthenticationService.SetCredentials($scope.username, $scope.password);
                            var myVar = setInterval(FlashService.Success, 2000);
                            FlashService.Success('Login successful', true);
			    $scope.pullself($scope.username);
                            $location.path('/main/dashboard');
                            $state.go('dashboard');
                        } else {
                            alert(response.message);
                        }
                    });
        	}

		$scope.pullself = function(email) {
		    var mydata = $.param({
                        email: email
                    });
		    $.ajax({
                        type: "GET",
                        url: 'https://yakume.xyz/api/userprofile',
                        data: mydata,
                        success: function(response){
			    var temp = JSON.parse(response);
			    AuthenticationService.selfprofile.name = temp.name;
			    AuthenticationService.selfprofile.email = temp.email;
                        }
                    });
		}

            	$scope.myFacebookLogin = function() {

                    FB.getLoginStatus(function(response) {

                    if (response.status === 'connected') {
                        FB.api('/me', function(response) {
                            //console.log('Successful login for: ' + response.name);
                            var authdata = FB.getAuthResponse().accessToken;
                            AuthenticationService.SetFBCredentials(response.name, authdata, function(response) {
                                $scope.$apply( function () { $location.path('/main/dashboard').replace() } );
                            });

                        });
                        var myVar = setInterval(FlashService.Success, 2000);
                        FlashService.Success('Login successful', true);

                        
                        

                    } else if (response.status == 'not_authorized') {
                        FB.login(function(response) {
                            if (response.status === 'connected') {

                                FB.api('/me', function(response) {
                                    var authdata = FB.getAuthResponse().accessToken;
                                    AuthenticationService.SetFBCredentials(response.name, authdata, function(response) {
                                        $scope.$apply( function () { $location.path('/main/dashboard').replace() } );
                                    });

                                });
                                
                                var myVar = setInterval(FlashService.Success, 2000);
                                FlashService.Success('Login successful', true);
                            }

                        });
                    } else {
                        FB.login(function(response) {
                            if (response.status === 'connected') {
                                FB.api('/me', function(response) {
                                    var authdata = FB.getAuthResponse().accessToken;
                                    AuthenticationService.SetFBCredentials(response.name, authdata, function(response) {
                                        $scope.$apply( function () { $location.path('/main/dashboard').replace() } );
                                    });

                                });
                                
                                var myVar = setInterval(FlashService.Success, 2000);
                                FlashService.Success('Login successful', true);
                            }
                        });

                    }
                });




            }
    	};


})();
