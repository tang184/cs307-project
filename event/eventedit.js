(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('EventEdit',EventEdit);

        EventEdit.$inject = ['$scope', '$location', 'FlashService', '$compile'];
        function EventEdit($scope, $location, FlashService, $compile) {
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

                $scope.create = true;





    /* Timepicker */               

                
                $scope.showmap = function() {
        			var mapCanvas = document.getElementById("map");
        			var mapOptions = {
        				center: new google.maps.LatLng(51.5, -0.2), 
        				zoom: 10
        			}
                    var map = new google.maps.Map(mapCanvas, mapOptions);
                }

                $scope.eventsubmit = function(event) {
                    $scope.event.event_time= $('.timepicker-example').val();
                    $scope.event.event_date= $('.bootstrap-datepicker').val();
                    console.log(event);
                }

                

		
        }


        
})();
