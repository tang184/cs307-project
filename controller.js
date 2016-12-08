(function () {
    'use strict';

    var app = angular.module('mainApp',['ngRoute','ui.router', 'ngCookies', 'pascalprecht.translate', 'ngDialog']);
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

            .state('forgetpassword', {
                controller: 'ForgetPasswordController',
                templateUrl: 'ForgotPs/forgotps.view.html',
                url:"/forgetpw"

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

            .state('profile_others', {
                parent:'main',
                controller: 'ProfileOthersController',
                templateUrl: 'userProfile/profile.others.html',
                url:"/profileothers/{profile_others_email}",
                //authenticated: true
            })

            .state('main', {
                abstract: true,
                url: '/main',
                controller: 'MainController',
                templateUrl: 'main/main.html'
            })

            .state('eventedit', {
                parent:'main',
                controller: 'EventEdit',
                templateUrl: 'event/edit.html',
                url:"/eventedit",
            })


            .state('hotevents', {
                parent:'main',
                controller: 'HoteventController',
                templateUrl: 'hotevents/hotevents.view.html',
                url:"/hotevents",
            })

            .state('myevents', {
                parent:'main',
                controller: 'MyeventController',
                templateUrl: 'myevents/myevents.view.html',
                url:"/myevents",
            })

            .state('searchevents', {
                parent:'main',
                controller: 'SearcheventsController',
                templateUrl: 'searchevents/searchevents.view.html',
                url:"/searchevents",
            })

            .state('searchuser', {
                parent:'main',
                controller: 'SearchuserController',
                templateUrl: 'userProfile/search_user.html',
                url:"/searchuser",
            })

            $urlRouterProvider.otherwise('/main/dashboard');

    });
    app.config(['$translateProvider', function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'i18n/',
            suffix: '.json'
        });
        var lang = getFirstBrowserLanguage().toLowerCase();
        if (lang.indexOf('zh') > -1) {
            lang = 'zh';
        }
        if (lang.indexOf('en') > -1) {
            lang = 'en';
        }
        $translateProvider.preferredLanguage(lang);
        //$translateProvider.useLocalStorage();
    }]);

    app.controller('LangCtrl', ['$cookies', '$scope', '$translate',function($cookies, $scope, $translate) {
        if ($cookies.get('yakumelanguage') == 'en') {
            $scope.language = "English";
        } else if ($cookies.get('yakumelanguage') == 'zh'){
            $scope.language = "简体中文";
        } else {
            $scope.language = "Default";
        }
        
        $scope.update = function() {
            if ($scope.language == "English") {
                $cookies.remove('yakumelanguage');
                $translate.use('en');
                $cookies.put('yakumelanguage',"en");
            } else if ($scope.language == "简体中文") {
                $cookies.remove('yakumelanguage');
                $translate.use('zh');
                $cookies.put('yakumelanguage',"zh");
            }
        }
    }]);

    

    var getFirstBrowserLanguage = function () {
        var nav = window.navigator,
            browserLanguagePropertyKeys = ['language', 'userLanguage', 'browserLanguage'],
            i,
            language;

        // support for HTML 5.1 "navigator.languages"
        if (Array.isArray(nav.languages)) {
            for (i = 0; i < nav.languages.length; i++) {
                language = nav.languages[i];
                if (language && language.length) {
                    return language;
                }
            }
        }

        // support for other well known properties in browsers
        for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
            language = nav[browserLanguagePropertyKeys[i]];
            if (language && language.length) {
                return language;
            }
        }

        return null;
    };


    //app.run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
    app.run(function($rootScope, $location, $cookies, $translate, $cookieStore, $http) {
        // keep user logged in after page refresh
        if ($cookies.get('yakumelanguage')) {
            $translate.use($cookies.get('yakumelanguage'));
        }
        $rootScope.globals = $cookies.getObject('globals') || {};
        console.log($rootScope.globals.currentUser);
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register', '/forgetpw']) === -1;
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
