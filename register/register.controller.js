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
                
                var myconfig = {

                }

                var mydata = $.param({
                    email: vm.user.email,
                    name: vm.user.userName,
                    password: vm.user.password
                });


                $.ajax({
                      type: "POST",
                      url: 'https://yakume.xyz/api/register',
                      data: mydata,
                      success: function(response){
                        console.log(response);
                      }
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
