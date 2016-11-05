(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('MyeventController', MyeventController);

    MyeventController.$inject = ['$scope', '$location', 'FlashService', '$rootScope'];
        function MyeventController($scope, $location, FlashService, $rootScope) {

            $("#bodyBackground").css('background', 'white');
            $scope.allevents = [];
            $scope.events;

            $scope.updateevents = function(eventlist) {
                $scope.allevents = eventlist;
                $scope.$apply();
            }

            $scope.pull_all_events = function() {

                $scope.email = $rootScope.globals.currentUser.email;
                console.log($scope.email);
                var mydata = $.param({
                    //email: $scope.email
                });



                $.ajax({
                    type: "GET",
                    url: 'https://yakume.xyz/api/myevents',
                    data: mydata,
                    success: function(response){
                        console.log(response);
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
