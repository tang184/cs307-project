(function () {
    'use strict';

    angular
        .module('mainApp')
        .factory('AuthenticationService', AuthenticationService);
    AuthenticationService.$inject = ['$http', '$cookieStore', '$cookies', '$document', '$rootScope', '$timeout', '$state', '$location'];

    function AuthenticationService($http, $cookieStore, $cookies, $document, $rootScope, $timeout, $state, $location) {
        var service = {};

        service.Login = Login;
        service.SetCredentials = SetCredentials;
        service.SetFBCredentials = SetFBCredentials;
        service.ClearCredentials = ClearCredentials;
        service.Logout = Logout;
        

        return service;

        

        function Login(username, password, callback) {

            var mydata = $.param({
                email: username,
                password: password
            });


            $.ajax({
                  type: "POST",
                  url: 'https://yakume.xyz/api/login',
                  data: mydata,
                  success: function(response, testStatus, request){
                    callback(response, request);

                  }
            });

        }

        function SetCredentials(username, password, callback) {
            var authdata = Base64.encode(username + ':' + password);
            var mydata = $.param({
                email: username
            });

            $.ajax({
                type: "GET",
                url: 'https://yakume.xyz/api/userprofile',
                data: mydata,
                success: function(response){
                    var temp = JSON.parse(response);
                    $.ajax({
                        type: "GET",
                        url: 'https://yakume.xyz/api/avatar/get',
                        data: mydata,
                        success: function(response){
                            $rootScope.globals = {
                                currentUser: {
                                    username: temp.name,
                                    email: temp.email,
                                    city: temp.city,
                                    aboutme: temp.description,
                                    avatar: response,
                                    authdata: authdata
                                }
                            };
                            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line                            
                            $cookies.putObject('globals', $rootScope.globals);
                            callback("success");            
                        }
                    });

                    $.ajax({
                        type: "GET",
                        url: 'https://yakume.xyz/api/myevents',
                        success: function(response){
                            console.log(response);
                            var events_attend_num = JSON.parse(response).events;
			                 $rootScope.globals.event_attend = [];
                            $.each(events_attend_num, function (i, item) {
                                var mydata = $.param({
                                    eventid : item
                                });
                                $.ajax({
                                    type: "GET",
                                    url: 'https://yakume.xyz/api/getevent',
                                    data: mydata,
                                    success: function(response){
                                        console.log(response);
                                        var t = JSON.parse(response);
                                        $rootScope.globals.event_attend.push(t);
                                    }
                                });
                            })
			
                            
                        }
                    });

                    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
                    //$cookies.putObject('globals', $rootScope.globals);
      
                }
            });




            

            
        }

        function SetFBCredentials(username, accessToken, callback) {
            var authdata = accessToken;
                var mydata = $.param({
                        fbdata: authdata,                
                });

            $.ajax({
                  type: "POST",
                  url: 'https://yakume.xyz/api/fblogin',
                  data: authdata,
                  success: function(response, testStatus, request){
                      console.log(response);
                      callback(response, request);
                  }
            });
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookies.put('globals', $rootScope.globals);

            callback($rootScope.globals.currentUser);
        }

        function Logout() {
            var mydata = $.param({
            });

            $.ajax({
                  type: "GET",
                  url: 'https://yakume.xyz/api/logout',
                  data: mydata,
                  success: function(response, testStatus, request){
                      console.log(response);
                  }
            });

            //service.selfprofile = {};
            $location.path('/login');
            $state.go('login');
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookies.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic';
        }
    }

    // Base64 encoding service used by AuthenticationService
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },
    };


})();
