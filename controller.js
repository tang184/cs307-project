(function () {
    'use strict';

    var app = angular.module('mainApp',['ngRoute']);

    app.config(function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'LoginController',
                templateUrl: 'login/login.view.html',
            
            })
            .when('/register', {
                controller: 'RegisterController',
                templateUrl: 'register/register.view.html',
            })
            .when('/dashboard', {
                controller: 'DashboardController',
                templateUrl: 'dashboard/dashboard.view.html',
            })
            

            .otherwise({redirectTo: '/' });
    });

    

})();