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

                $scope.lat;
                $scope.lng;
                //$scope.mapurl;


                $scope.getplace = function() {

                    $scope.showMap = false;

                    var s="https://maps.googleapis.com/maps/api/geocode/json?address="
                    var key="&key=AIzaSyAFhzO5tGWXiCCtH5y6XW6ycS-1fbC4uYA"
                    var p = s + $scope.event.event_location + key;

                    if ($scope.event.event_location) {
                        $.ajax({
                            url: p,
                            type: "GET",
                            success: function(response){
                                var address = response.results[0];
                                if (address) {
                                    $scope.event.lat = address.geometry.location.lat;
                                    $scope.event.lng = address.geometry.location.lng;
                                    var tmp = address.address_components
                                    for (var i in tmp) {
                                        if (tmp[i].types[0] == "postal_code") {
                                            $scope.event.zip = tmp[i].long_name;
                                        }
                                    }
                                    console.log($scope.event.zip);
                                    $scope.mapurl="https://maps.googleapis.com/maps/api/staticmap?center=" + $scope.event.lat + "," + $scope.event.lng + 
                                    "&zoom=16&size=320x200&&markers=color:red%7Clabel:C%7C" + $scope.event.lat + "," + $scope.event.lng 
                                    + "&key=AIzaSyAFhzO5tGWXiCCtH5y6XW6ycS-1fbC4uYA";

                                } else {
                                    $scope.mapurl="img/loc_404.png"
                                }
                            }
                                     
                        });
                    }
                                      
                }

                $scope.eventsubmit = function(event) {
        		    var start_date = $('.start_datepicker').val();
        		    var start_time = $('.start_timepicker').val();
        		    var start_stamp = new Date(start_date + " " + start_time).getTime()

        		    var end_date = $('.end_datepicker').val();
        		    var end_time = $('.end_timepicker').val();
        		    var end_stamp = new Date(end_date + " " + end_time).getTime()

                    $scope.event.timestamp = start_stamp
                    $scope.event.duration = end_stamp - start_stamp;

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

		
        }


        
})();
