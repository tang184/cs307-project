(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$location', 'FlashService', 'AuthenticationService'];

    	function LoginController($scope, $location, FlashService, AuthenticationService) {
        	$("#bodyBackground").css('background-image', 'url(assets/image-resources/blurred-bg/blurred-bg-3.jpg)');
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
                /*AuthenticationService.ClearCredentials();*/
            })();

        	$scope.register = function() {
        		$location.path('/register');
        	}

        	$scope.login = function() {

                AuthenticationService.Login($scope.username, $scope.password, function (response) {
                    if (response.success) {
                        //AuthenticationService.SetCredentials(vm.username, vm.password);
                        var myVar = setInterval(FlashService.Success, 2000);
                        FlashService.Success('Login successful', true);
                        $location.path('/main/dashboard');
                    } else {
                        alert(response.message);
                    }
                });
        	}

            $scope.myFacebookLogin = function() {
                FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        if (!$rootScope.loggedIn) {
                            $rootScope.loggedIn = true;
                        }
                        var myVar = setInterval(FlashService.Success, 2000);
                        FlashService.Success('Login successful', true);
                        $scope.$apply( function () { $location.path('/main/dashboard').replace() } );
                        FB.api('/me', function(response) {
                            //console.log('Successful login for: ' + response.name);

                            var accessToken = FB.getAuthResponse().accessToken;
                            console.log(accessToken);
                        });
                    } else if (response.status == 'not_authorized') {
                        FB.login(function(response) {
                            if (response.status === 'connected') {
                                if (!$rootScope.loggedIn) {
                                    $rootScope.loggedIn = true;
                                }
                                var myVar = setInterval(FlashService.Success, 2000);
                                FlashService.Success('Login successful', true);
                                $scope.$apply( function () { $location.path('/main/dashboard').replace() } );
                            }

                        });
                    } else {
                        FB.login(function(response) {
                            if (response.status === 'connected') {
                                if (!$rootScope.loggedIn) {
                                    $rootScope.loggedIn = true;
                                }
                                var myVar = setInterval(FlashService.Success, 2000);
                                FlashService.Success('Login successful', true);
                                $scope.$apply( function () { $location.path('/main/dashboard').replace() } );
                            }
                        });

                    }
                });




            }
    	};


})();
