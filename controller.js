(function () {
    'use strict';

    var app = angular.module('mainApp',['ngRoute','ui.router']);
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
                url:"/dashboard"
            })

            .state('main', {
                abstract: true,
                url: '/main',
                templateUrl: 'main/main.html'
            });    
            

            $urlRouterProvider.otherwise('/login')
    });

    

})();