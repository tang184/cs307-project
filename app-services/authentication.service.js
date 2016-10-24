﻿(function () {
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
        service.UpdateEmailFromCookie = UpdateEmailFromCookie;
        service.UpdateProfile = UpdateProfile;
        service.SetName = SetName;
        service.GetEmail = GetEmail;
        service.Logout = Logout;
        service.selfprofile = {};

        return service;

        function UpdateEmailFromCookie() {
            var temp1 = $document[0].cookie.split("%22")[5].split("%40");
            service.selfprofile.email = temp1[0] + "@" + temp1[1];
        }

        function GetEmail() {
            if (service.selfprofile.email === undefined) {
                service.UpdateEmailFromCookie();
            }
            return service.selfprofile.email;
        }

        function UpdateProfile(newfunc) {
            if (service.selfprofile.email === undefined) {
                service.UpdateEmailFromCookie();
            }
            var mydata = $.param({
                email: service.selfprofile.email
            });
            $.ajax({
                type: "GET",
                url: 'https://yakume.xyz/api/userprofile',
                data: mydata,
                success: function(response){
                    var temp = JSON.parse(response);
                    service.selfprofile.name = temp.name;
                    newfunc(temp);
                }
            });
        }

        function SetName(func) {
            if (service.selfprofile.name === undefined) {
                var newfunc = function (obj) {
                    func(obj.name, true);
                }
                service.UpdateProfile(newfunc);
            }
            else {
                func(service.selfprofile.name, false);
            }
        }

        function Login(username, password, callback) {

            var mydata = $.param({
                email: username,
                password: password
            });


            $.ajax({
                  type: "POST",
                  url: 'https://yakume.xyz/api/login',
                  data: mydata,
		  /*xhrFields: {
    		      withCredentials: true
		  },*/
                  success: function(response, testStatus, request){
                      console.log(response);
                      callback(response, request);
                  }
                });

        }

        function SetCredentials(username, password) {
            var authdata = Base64.encode(username + ':' + password);

            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };

            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        }

        function SetFBCredentials(username, accessToken, callback) {
            var authdata = accessToken;

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
            $cookieStore.put('globals', $rootScope.globals);
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

            service.selfprofile = {};
            $location.path('/login');
            $state.go('login');
        }

        function ClearCredentials() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
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