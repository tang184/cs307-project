(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$location', '$scope', '$http', 'FlashService'];
        function RegisterController($location, $scope, $http, FlashService) {
            $("#bodyBackground").css('background-image', 'url(assets/image-resources/blurred-bg/blurred-bg-7.jpg)');

            $scope.vm = {};
            $scope.confirmPassword = false;

            $scope.back = function() {
                $location.path('/login');
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
                            if (response == "ERR_USER_EMAIL_TAKEN") {
                                alert("Email already taken");
                            } else {
                                var myVar = setInterval(FlashService.Success, 2000);
                                FlashService.Success('Signup successful', true);
                            }			  
                      }
                });
                $location.path('/login');
                                                      


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
