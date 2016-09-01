(function () {
    'use strict';

    var app = angular.module('mainApp',['ngRoute']);

    app.config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'dashboard/dashboard.html',
            
            })
            .when('/login', {
                templateUrl: 'login/login.view.html',
            })

            .otherwise({redirectTo: '/login' });
    });

    

})();