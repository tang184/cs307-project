(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('ProfileController', ProfileController);

        ProfileController.$inject = ['$scope', '$rootScope','$location','$cookies', 'FlashService', 'AuthenticationService'];
            function ProfileController($scope, $rootScope, $location, $cookies, FlashService, AuthenticationService) {

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
                        newname: $scope.username
                    });
                    $.ajax({
                        type: "POST",
                        url: 'https://yakume.xyz/api/changeusername',
                        data: mydata,
                        success: function(response){
                            if (response != "SUCCESS") {
                                alert(response);
                            }
                        }
                    });
                    if ($scope.profileimage) {
                        var postimage = $.param({
                            filename: $scope.profileimage
                        });
                        $.ajax({
                            type: "POST",
                            url: 'https://yakume.xyz/api/avatar/update',
                            data: postimage,
                            success: function(response){
                                if (response != "SUCCESS") {
                                    alert(response);
                                }
                            }
                        });
                    }
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
                            if (response == "SUCCESS") {
                                $scope.updatePassword();
                            }
                        }
                    });
                }

                $("#file").change(function () {
                    filePreview(this);
                });

                function filePreview(input) {
                    if (input.files && input.files[0]) {
                        var formData = new FormData();
                        if (input.files[0].type == "image/png") {
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                $('#uploadForm + img').remove();
                                $('#uploadForm').after('<img src="'+e.target.result+'" width="150" height="100"/>');
                                /*$scope.uploadimage = {
                                    uploaded_file: e.target.result
                                }*/
                                formData.append('uploaded_file', $('input[type=file]')[0].files[0]);
                                $.ajax({
                                    type: "POST",
                                    url: 'https://yakume.xyz/img/upload_png',
                                    data: formData,
                                    contentType: false,
                                    processData: false,
                                    success: function(response) {
                                        $scope.profileimage = response;
                                    }
                                });

                            }
                            reader.readAsDataURL(input.files[0]);
                        } else if (input.files[0].type == "image/jpeg"){
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                $('#uploadForm + img').remove();
                                $('#uploadForm').after('<img src="'+e.target.result+'" width="150" height="100"/>');
                                /*$scope.uploadimage = {
                                    uploaded_file: e.target.result
                                }*/
                                formData.append('uploaded_file', $('input[type=file]')[0].files[0]);
                                $.ajax({
                                    type: "POST",
                                    url: 'https://yakume.xyz/img/upload_jpg',
                                    data: formData,
                                    contentType: false,
                                    processData: false,
                                    success: function(response){
                                        $scope.profileimage = response;
                                    }
                                });
                            }
                            reader.readAsDataURL(input.files[0]);
                        }                        
                    }
                }

                $scope.editProfile = function() {
                    $scope.isEdit = true;
                }
                $scope.changePassword = function() {
                    $scope.newpassword = "";
                    $scope.c_password = "";
                    $scope.oldpassword = "";
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
