(function () {
    'use strict';

    var app = angular.module('mainApp',['ngRoute']);

    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
            
            })
            .when('/dashboard', {
                templateUrl: 'dashboard/dashboard.view.html',
            })
            .when('/register', {
                templateUrl: 'register/register.view.html',
            })
            .otherwise({redirectTo: '/' });
    });

    

})();