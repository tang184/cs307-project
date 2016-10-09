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

                /*$http({
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


                $.ajax({
                    
                    type: "POST",
                    success: function(response){
                        var address = response.results[0];
                        if (address) {
                            $scope.event.lat = address.geometry.location.lat;
                            $scope.event.lng = address.geometry.location.lng;
                            $scope.mapurl="https://maps.googleapis.com/maps/api/staticmap?center=" + $scope.lat + "," + $scope.lng + "&zoom=16&size=320x200&path=weight:3%7Ccolor:blue%7Cenc:{coaHnetiVjM??_SkM??~R&key=AIzaSyAFhzO5tGWXiCCtH5y6XW6ycS-1fbC4uYA";

                        } else {
                            $scope.mapurl="/img/loc_404.png"
                        }
                    }
                    error: function (textStatus, errorThrown) {
                        console.log(textStatus);
                    }         
                });*/

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
