(function () {
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
                parent:'main',
                controller: 'DashboardController',
                templateUrl: 'dashboard/dashboard.view.html',
                url:"/dashboard",
                //authenticated: true
            })

            .state('profile', {
                parent:'main',
                controller: 'ProfileController',
                templateUrl: 'userProfile/profile.view.html',
                url:"/profile",
                //authenticated: true
            })

            .state('main', {
                abstract: true,
                url: '/main',
                controller: 'MainController',
                templateUrl: 'main/main.html'
            })

            .state('eventedit123', {
                parent:'main',
                controller: 'EventEdit',
                templateUrl: 'event/edit.html',
                url:"/eventedit",
                //authenticated: true
            })


            $urlRouterProvider.otherwise('/main/dashboard');
    });


    //app.run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    app.run(function($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        console.log($rootScope.globals.currentUser);
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
    });



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
