(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('EventEdit',EventEdit);

        EventEdit.$inject = ['$scope', '$location', 'FlashService'];
        function EventEdit($scope, $location, FlashService) {

                $("#bodyBackground").css('background', 'white');

                $scope.create = true;

                $scope.test = function() {
                    console.log("hello");
                }
                $scope.showmap = function() {
			var mapCanvas = document.getElementById("map");
			var mapOptions = {
				center: new google.maps.LatLng(51.5, -0.2), 
				zoom: 10
			}
			var map = new google.maps.Map(mapCanvas, mapOptions);
                }
                $scope.Cnext = function() {
                    console.log("next month");
                }

		
        }
})();
