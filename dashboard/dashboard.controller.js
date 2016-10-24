(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$location', 'FlashService'];
        function DashboardController($scope, $location, FlashService) {
            
            $("#bodyBackground").css('background', 'white');
            $scope.allevents = [];

            $scope.updateevents = function(eventlist) {
                for (var i = 0; i < 5; i++) {
                    eventlist[i].time = $scope.timeConverter(eventlist[i].time);
                    $scope.allevents.push(eventlist[i]);
                }
                //$scope.allevents = eventlist;
                $scope.$apply();
            }

            $scope.pull_all_events = function() {
                var mydata = $.param({
                });

                $.ajax({
                    type: "GET",
                    url: 'https://yakume.xyz/api/getevent',
                    data: mydata,
                    success: function(response){
                        var events = JSON.parse(response).events;
                        $scope.updateevents(events);
                    }
                });
            }

            $scope.view_event = function(id) {
                alert("viewevent".concat(id.toString()));
            }

            $scope.pull_all_events();

            $scope.timeConverter = function(UNIX_timestamp){
                  var a = new Date(UNIX_timestamp);
                  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  var year = a.getFullYear();
                  var month = months[a.getMonth()];
                  var date = a.getDate();
                  var time = month + ' ' + date + ' ' +  year;
                  return time;
            }

        };


})();