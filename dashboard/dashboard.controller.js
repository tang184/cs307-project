(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$rootScope','$location', '$cookies','FlashService', 'ngDialog', 'EventService'];
        function DashboardController($scope, $rootScope, $location, $cookies, FlashService, ngDialog, EventService) {

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

            $scope.pull_events_attend = function() {
                var mydata = $.param({
                });

                $.ajax({
                    type: "GET",
                    url: 'https://yakume.xyz/api/myevents',
                    data: mydata,
                    success: function(response){
                        var events_list = JSON.parse(response).events;
						EventService.pull_event_by_ID_list(events_list, function(events) {
							$scope.events_attend = EventService.pack_event_list(events);
							$scope.events_attend.sort_by_time(true);
							$scope.$apply();
						});
                    }
                });
            }

            $scope.showspecificevent = function(id) {
				EventService.showspecificevent($scope, $rootScope, $location, ngDialog, id);
			}
			
			$scope.pull_events_all();
			$scope.pull_events_attend();
    };


})();
