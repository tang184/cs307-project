(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$location', '$rootScope', '$scope', '$http', 'FlashService'];
        function RegisterController($location, $rootScope, $scope, $http, FlashService) {
            $("#bodyBackground").css('background-image', 'url(assets/image-resources/blurred-bg/blurred-bg-7.jpg)');

            $.getScript('https://www.google.com/recaptcha/api.js');

            $scope.vm = {};
            $scope.confirmPassword = false;

            $scope.back = function() {
                $location.path('/login');
            }

            $scope.submit = function(vm) {
                if ($("#g-recaptcha-response").val()) {
                    var mydata = $.param({
                        email: vm.user.email,
                        name: vm.user.userName,
                        password: vm.user.password,
                        recaptcha: $("#g-recaptcha-response").val()
                    });


                    $.ajax({
                          type: "POST",
                          url: 'https://yakume.xyz/api/registerwithrecaptcha',
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
