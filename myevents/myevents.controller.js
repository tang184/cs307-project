(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('MyeventController', MyeventController);

    MyeventController.$inject = ['$scope', '$location', 'FlashService'];
        function MyeventController($scope, $location, FlashService) {

            $("#bodyBackground").css('background', 'white');
            $scope.allevents = [];
            $scope.events;

            $scope.updateevents = function(eventlist) {
                $scope.allevents = eventlist;
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

                        $scope.events = JSON.parse(response).events;
                        //console.log(events);
                        $scope.updateevents($scope.events);
                    }
                });
            }

            $scope.view_event = function(id) {
                alert("viewevent".concat(id.toString()));
            }

            $scope.pull_all_events();

            $scope.sortbytime = function() {
                $scope.events.sort(function(a,b){
                  return parseInt(a.time) - parseInt(b.time);
                });
                $scope.updateevents($scope.events);
                console.log($scope.events);
            }

            $scope.sortbyname = function() {
				          $scope.events.sort(function(a,b){
                    return a.title.localeCompare(b.title);
				          });
				          $scope.updateevents($scope.events);
                  console.log($scope.events);
            }

            $scope.sortbypublish = function() {
              $scope.events.sort(function(a,b){
                  return parseInt(a.timeposted) - parseInt(b.timeposted);
              });
              $scope.updateevents($scope.events);
              console.log($scope.events);
            }


        };


})();
