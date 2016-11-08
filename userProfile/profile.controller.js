(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('ProfileController', ProfileController);

        ProfileController.$inject = ['$scope', '$location','$cookies', 'FlashService', 'AuthenticationService'];
            function ProfileController($scope, $location, $cookies, FlashService, AuthenticationService) {

                $("#bodyBackground").css('background', 'white');

                $scope.tab = 1;

                $scope.isEdit = false;
                $scope.change_password = false;

                $scope.user={};

                $scope.userinfo = $cookies.getObject('globals') || {};
                $scope.username = $scope.userinfo.currentUser.username;
                $scope.email = $scope.userinfo.currentUser.email;

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

                        }
                    });
                    $scope.isEdit = false;
                }

                $scope.uploadnewpass = function() {
                    var mydata = $.param({
                        password: $scope.newpassword
                    });
                    $.ajax({
                        type: "POST",
                        url: 'https://yakume.xyz/api/changepassword',
                        data: mydata,
                        success: function(response){
                            console.log(response);
                        }
                    });
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

                $scope.confirmPassword = false;
                $scope.sameAsOldPassword = false;

                $scope.checkPassword = function() {
                    if ($scope.oldpassword == $scope.newpassword) {
                        $scope.sameAsOldPassword = true;
                    } else {
                        $scope.sameAsOldPassword = false;
                    }
                    if ($scope.newpassword == $scope.c_password) {
                        $scope.confirmPassword = true;
                    } else {
                        $scope.confirmPassword = false;
                    }
                }








        }

    })();
