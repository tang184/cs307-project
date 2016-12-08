(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('HoteventController', HoteventController);

    HoteventController.$inject = ['$scope','$rootScope', '$location', 'FlashService', 'ngDialog', 'EventService'];
        function HoteventController($scope, $rootScope ,$location, FlashService, ngDialog, EventService) {


            $("#bodyBackground").css('background', 'white');
			
            $scope.pull_events_all = function() {
                var mydata = $.param({
                });

                $.ajax({
                    type: "GET",
                    url: 'https://yakume.xyz/api/getevent',
                    data: mydata,
                    success: function(response){
                        var events_list = JSON.parse(response).events;
						// because this is a all information list, it is needed to be fixed to a only ID list.
						var l = [];
						var i;
						for (i in events_list) {
							l.push(events_list[i].id);
						}
						EventService.pull_event_by_ID_list(l, function(events) {
							$scope.events_all = EventService.pack_event_list(events);
							$scope.events_all.sort_by_time(true);
							$scope.$apply();
						});
                    }
                });
            }

            $scope.showspecificevent = function(id) {
				EventService.showspecificevent($scope, $rootScope, $location, ngDialog, id);
			}

			$scope.pull_events_all();
        };




})();
