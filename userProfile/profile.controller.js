(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('ProfileController', ProfileController);

        ProfileController.$inject = ['$scope', '$location', 'FlashService', 'AuthenticationService'];
            function ProfileController($scope, $location, FlashService, AuthenticationService) {

                $("#bodyBackground").css('background', 'white');

                $scope.tab = 1;

                $scope.isEdit = false;
                $scope.change_password = false;

                $scope.user={};

                $scope.set_name = function(s, update) {
                    $scope.username = s;
                    $scope.newusername = s;
                    if (update) {
                        $scope.$apply();
                    }
                }
                AuthenticationService.SetName($scope.set_name);

                $scope.email = AuthenticationService.GetEmail();

                $scope.city = "";

                $scope.aboutme = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante."


                $scope.SaveProfile = function() {
                    
                    var mydata = $.param({
                        newname: $scope.newusername
                    });


                    $.ajax({
                        type: "POST",
                        url: 'https://yakume.xyz/api/changeusername',
                        data: mydata,
                        success: function(response){
                            console.log(response);
                            AuthenticationService.selfprofile = {}
                            AuthenticationService.SetName($scope.set_name);
                            $scope.email = AuthenticationService.GetEmail();
                        }
                    });
                    $scope.isEdit = false;
                }
                
                $scope.editProfile = function() {
                    $scope.isEdit = true;
                }
                $scope.changePassword = function() {
                    $scope.change_password = true;
                }
                $scope.updatePassword = function() {
                    $scope.change_password = false;
                }

                $scope.checkPassword = function() {
                if ($scope.user.password == $scope.c_password) {
                    $scope.confirmPassword = true;
                } else {
                    $scope.confirmPassword = false;
                }

            }





        }

    })();
