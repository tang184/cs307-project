﻿(function () {
    'use strict';

    var app = angular.module('mainApp',['ngRoute','ui.router', 'ngCookies']);
    app.config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
                url:"/login"

            })

            .state('register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
                url:"/register"

            })

            .state('dashboard', {
                /*resolve: {
                    "check": function($location, $rootScope) {
                        if (!$rootScope.loggedIn) {
                            $scope.$apply(function() { // simple trick otherwise dashboard page will still be loaded.
                                $location.path('/');
                            });
                        }
                    }
                },*/
                parent:'main',
                controller: 'DashboardController',
                templateUrl: 'dashboard/dashboard.view.html',
                url:"/dashboard",
                //authenticated: true
            })

            .state('main', {
                abstract: true,
                url: '/main',
                templateUrl: 'main/main.html'
            });


            $urlRouterProvider.otherwise('/login')
    });


    /*app.run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    function run($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
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



})();
