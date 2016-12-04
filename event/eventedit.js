(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('EventEdit',EventEdit);

        EventEdit.$inject = ['$scope', '$location', 'FlashService','$http'];
        function EventEdit($scope, $location, FlashService, $http) {
                $scope.event={};

                $scope.event.price = 0;


                $("#bodyBackground").css('background', 'white');

                $.getScript('assets/widgets/timepicker/timepicker.js',function(){
                    $('.start_timepicker').timepicker();
                    $('.end_timepicker').timepicker();

                });
                $.getScript('assets/widgets/datepicker/datepicker.js',function(){
                    $('.start_datepicker').bsdatepicker(
                        {
                            format: 'yyyy-mm-dd'
                        }
                    );
                    $('.end_datepicker').bsdatepicker(
                        {
                            format: 'yyyy-mm-dd'
                        }
                    );

                });

                $scope.latitude;
                $scope.longitude;
                $scope.getplace = function() {

                    var s="https://maps.googleapis.com/maps/api/geocode/json?address="
                    var key="&key=AIzaSyAFhzO5tGWXiCCtH5y6XW6ycS-1fbC4uYA"
                    var p = s + $scope.event.address + key;

                    if ($scope.event.address) {
                        $.ajax({
                            url: p,
                            type: "GET",
                            success: function(response){
                                var address = response.results[0];
                                if (address) {
                                    $scope.event.latitude = address.geometry.location.lat;
                                    $scope.event.longitude = address.geometry.location.lng;
                                    var tmp = address.address_components
                                    for (var i in tmp) {
                                        if (tmp[i].types[0] == "postal_code") {
                                            $scope.event.zipcode = tmp[i].long_name;
                                        }
                                    }
                                    $scope.mapurl="https://maps.googleapis.com/maps/api/staticmap?center=" + $scope.event.latitude + "," + $scope.event.longitude +
                                    "&zoom=16&size=320x200&&markers=color:red%7Clabel:C%7C" + $scope.event.latitude + "," + $scope.event.longitude
                                    + "&key=AIzaSyAFhzO5tGWXiCCtH5y6XW6ycS-1fbC4uYA";
                                    $scope.$apply();

                                } else {
                                    $scope.mapurl="img/loc_404.png";
                                    $scope.$apply();
                                }
                            }
                        });
                    }
                }

                $scope.hasCorrectTime = false;
                $scope.hasSubmit = false;

                function isInt(value) {
                  var x = parseFloat(value);
                  return !isNaN(value) && (x | 0) === x;
                }

                $scope.eventsubmit = function(event) {
                    $scope.hasSubmit = true;

        	        var start_date = $('.start_datepicker').val();
                    var start_time = $('.start_timepicker').val();
                    var start_stamp = new Date(start_date + " " + start_time).getTime();
                    var end_date = $('.end_datepicker').val();
                    var end_time = $('.end_timepicker').val();
                    var end_stamp = new Date(end_date + " " + end_time).getTime()
                    var now = new Date();
                    var duration = end_stamp - start_stamp;
                    if (start_stamp > now && duration > 0) {
                        $scope.hasCorrectTime = true;
                    }

                    $scope.event.timestamp = start_stamp
                    $scope.event.duration = duration;
                    $scope.event.recurring = 0;
                    if ($scope.recurday) {
                        $scope.event.recurring += 86400000 * $scope.recurday;
                    }
                    if ($scope.recurhour) {
                        $scope.event.recurring += 3600000 * $scope.recurhour;
                    }

                    console.log($scope.event);

                    if ($scope.hasCorrectTime) {
                        $.ajax({
                            type: "POST",
                            url: 'https://yakume.xyz/api/addevent',
                            data: $scope.event,
                            success: function(response) {
                                if (isInt(response) && $scope.event.coverimage) {
                                    var postimage = $.param({
                                        eventid: response,
                                        filename: $scope.event.coverimage
                                    });
                                    $.ajax({
                                        type: "POST",
                                        url: 'https://yakume.xyz/api/event/image/upload',
                                        data: postimage,
                                        success: function(response){
                                            if (response != "SUCCESS") {
                                                alert(response);
                                            }
                                            console.log(response);
                                        }
                                    });
                                }
                            }
                        });
                        $scope.eventcancel();
                    } else {
                        alert("event time expires or not valid");
                    }
            	    
                }

                $scope.eventcancel = function() {
                    window.history.back();
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
                                        $scope.event.coverimage = response;
                                        console.log(response);
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
                                        $scope.event.coverimage = response;
                                        console.log(response);
                                    }
                                });
                            }
                            reader.readAsDataURL(input.files[0]);
                        }
                        
                    }
                }


        }



})();
