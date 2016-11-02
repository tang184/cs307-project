(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('EventEdit',EventEdit);

        EventEdit.$inject = ['$scope', '$location', 'FlashService','$http'];
        function EventEdit($scope, $location, FlashService, $http) {
                $scope.event={};


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

                    $scope.showMap = false;

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

                                } else {
                                    $scope.mapurl="img/loc_404.png"
                                }
                            }
                        });
                    }
                }

                $scope.hasCorrectTime = false;
                $scope.hasSubmit = false;

                $scope.eventsubmit = function(event) {
                    $scope.hasSubmit = true;

        		    var start_date = $('.start_datepicker').val();
        		    var start_time = $('.start_timepicker').val();
        		    var start_stamp = new Date(start_date + " " + start_time).getTime()

        		    var end_date = $('.end_datepicker').val();
        		    var end_time = $('.end_timepicker').val();
        		    var end_stamp = new Date(end_date + " " + end_time).getTime()

                    var now = new Date();
                    var duration = end_stamp - start_stamp;
                    if (start_stamp > now && duration > 0) {
                        $scope.hasCorrectTime = true;
                    }
                    console.log($scope.hasCorrectTime);

                    $scope.event.timestamp = start_stamp
                    $scope.event.duration = duration;

		            console.log($scope.event);

        		    $.ajax({
                                type: "POST",
                                url: 'https://yakume.xyz/api/addevent',
                                data: $scope.event,
                                success: function(response){
                                    console.log(response);
                                }
                            });
                }

                $scope.eventcancel = function() {
                    window.history.back();
                }

                $("#file").change(function () {
                    filePreview(this);
                });

                function filePreview(input) {
                    if (input.files && input.files[0]) {
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            $('#uploadForm + img').remove();
                            $('#uploadForm').after('<img src="'+e.target.result+'" width="450" height="300"/>');

                        }
                        reader.readAsDataURL(input.files[0]);
                    }
                }


        }



})();
