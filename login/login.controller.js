(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$scope', '$location', 'FlashService'];
    	function LoginController($scope, $location, FlashService) {
    		
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
            window.fbAsyncInit = function() {
              FB.init({
                appId      : '1793641007572063',
                cookie     : true,  // enable cookies to allow the server to access 
                xfbml      : true,  // parse social plugins on this page
                version    : 'v2.5' // use graph api version 2.5
              });
              /*FB.getLoginStatus(function(response) {
                statusChangeCallback(response);
              });*/

            };

  // Load the SDK asynchronously
              (function(d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
              }(document, 'script', 'facebook-jssdk'));

              /*function testAPI() {
                console.log('Welcome!  Fetching your information.... ');
                FB.api('/me', function(response) {
                  console.log('Successful login for: ' + response.name);
                  
                });
              }*/

        	$scope.register = function() {
        		$location.path('/register');
        	}

        	$scope.login = function() {
        		var myVar = setInterval(FlashService.Success, 2000);
        		FlashService.Success('Login successful', true);
        		$location.path('/main/dashboard');
        	}

            $scope.myFacebookLogin = function() {
                FB.getLoginStatus(function(response) {
                    if (response.status === 'connected') {
                        FB.api('/me', function(response1) {
                            console.log('Successful login for: ' + response1.name);
                            $scope.$apply( function () { $location.path('/main/dashboard').replace() } ); 
                        });
                    } else if (response.status == 'not_authorized') {
                        FB.login(function(response) {
                            if (response.status === 'connected') {
                                FB.api('/me', function(response1) {
                                    console.log('Successful login for: ' + response1.name);
                                    $scope.$apply( function () { $location.path('/main/dashboard').replace() } ); 
                                });
                            }

                        });
                    } else {
                        FB.login(function(response) {
                            if (response.status === 'connected') {
                                FB.api('/me', function(response1) {
                                    console.log('Successful login for: ' + response1.name);
                                    $scope.$apply( function () { $location.path('/main/dashboard').replace() } ); 
                                });
                            }
                        });

                    }
                });

                

                
            }
    	};


})();




