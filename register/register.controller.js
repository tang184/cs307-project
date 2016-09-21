(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$location', '$scope', '$http'];
        function RegisterController($location, $scope, $http) {
            $("#bodyBackground").css('background-image', 'url(assets/image-resources/blurred-bg/blurred-bg-7.jpg)');

            $scope.vm = {};
            $scope.confirmPassword = false;

            $scope.back = function() {
                $location.path('/');
            }

            $scope.submit = function(vm) {
                var mydata = $.param({
                    email: vm.user.email,
                    name: vm.user.userName,
                    password: vm.user.password
                });
                var myconfig = {

                }

                $http({
                    method:'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 
                        'Access-Control-Allow-Origin': true
                    },
                    url:'https://yakume.xyz/api/register',
                    data:mydata, 
                    config:myconfig
                })
                .success(function (data, status, headers, config) {
                    alert("success.");
                })
                .error(function (response, data, status, headers, config) {
                    console.log(response);
                });



            }


            $scope.checkPassword = function() {
                if ($scope.vm.user.password == $scope.c_password) {
                    $scope.confirmPassword = true;
                } else {
                    $scope.confirmPassword = false;
                }

            }
        }


})();
