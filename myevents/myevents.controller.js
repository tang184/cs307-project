(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('MyeventController', MyeventController);

    MyeventController.$inject = ['$scope','$rootScope', '$location', 'FlashService', 'ngDialog', 'EventService'];
        function MyeventController($scope, $rootScope,  $location, FlashService, ngDialog, EventService) {

            $("#bodyBackground").css('background', 'white');

            $scope.pull_events_created = function() {
                var mydata = $.param({
                });

                $.ajax({
                    type: "GET",
                    url: 'https://yakume.xyz/api/eventcreated',
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
							$scope.events_created = EventService.pack_event_list(events);
							$scope.events_created.sort_by_time(true);
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

            $scope.pull_events_saved = function() {
                var mydata = $.param({
                });

                $.ajax({
                    type: "GET",
                    url: 'https://yakume.xyz/api/watchlist',
                    data: mydata,
                    success: function(response){
                        var events_list = JSON.parse(response).events;
						EventService.pull_event_by_ID_list(events_list, function(events) {
							$scope.events_saved = EventService.pack_event_list(events);
							$scope.events_saved.sort_by_time(true);
							$scope.$apply();
						});
                    }
                });
            }

            $scope.showspecificevent = function(id) {
				EventService.showspecificevent($scope, $rootScope, $location, ngDialog, id);
			}

            $scope.pull_events_attend();
            $scope.pull_events_created();
            $scope.pull_events_saved();

        };


})();
