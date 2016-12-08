(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('SearcheventsController', SearcheventsController);

    SearcheventsController.$inject = ['$scope','$rootScope', '$location', 'FlashService', 'ngDialog', 'EventService'];
        function SearcheventsController($scope, $rootScope ,$location, FlashService, ngDialog, EventService) {

            $("#bodyBackground").css('background', 'white');
            $scope.advance = false;
			$scope.events_result = [];
            $scope.showresult = false;

            $scope.showadvance = function() {
                $scope.advance = !$scope.advance;
            }

            $scope.search = function() {
                $scope.canapply = true;
                $scope.allevents = [];
                var mydata;
                if (!$scope.zip) {
                    $scope.zip = 0;
                }

                if ($scope.advance) {
                    mydata= $.param({
                        keyword : $scope.key,
                        zipcode : $scope.zip,
                        tag : $scope.tag
                    });
                } else {
                    mydata= $.param({
                        keyword : $scope.key,
                    });
                }

                $.ajax({
                    type: "GET",
                    url: 'https://yakume.xyz/api/event/search',
                    data: mydata,
                    success: function(response){
                        var events_list = JSON.parse(response).events;
						EventService.pull_event_by_ID_list(events_list, function(events) {
							$scope.events_result = EventService.pack_event_list(events);
							$scope.showresult = true;
							$scope.$apply();
						});
                    }
                });
            }

            $scope.showspecificevent = function(id) {
				EventService.showspecificevent($scope, $rootScope, $location, ngDialog, id);
			}

        };




})();
