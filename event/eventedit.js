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
                    $('.timepicker-example').timepicker();

                });
                $.getScript('assets/widgets/datepicker/datepicker.js',function(){
                    $('.bootstrap-datepicker').bsdatepicker(
                    {
                        format: 'yyyy-mm-dd'
                    }
                    );
                    
                });

                $scope.lat;
                $scope.lng;
                //$scope.mapurl;


    /* Timepicker */ 

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
                                    $scope.mapurl="https://maps.googleapis.com/maps/api/staticmap?center=" + $scope.event.lat + "," + $scope.event.lng + "&zoom=16&size=320x200&path=weight:3%7Ccolor:blue%7Cenc:{coaHnetiVjM??_SkM??~R&key=AIzaSyAFhzO5tGWXiCCtH5y6XW6ycS-1fbC4uYA";

                                } else {
                                    $scope.mapurl="img/loc_404.png"
                                }
                            }
                                     
                        });
                    }
                                      
                }
           

                
                

                $scope.eventsubmit = function(event) {
                    $scope.event.event_time= $('.timepicker-example').val();
                    $scope.event.event_date= $('.bootstrap-datepicker').val();
                    console.log(event);
                }

                

		
        }


        
})();
