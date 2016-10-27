(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$location', '$cookies','FlashService', 'ngDialog'];
        function DashboardController($scope, $location, $cookies, FlashService, ngDialog) {
            
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

            $scope.showspecificevent = function(event) {
                ngDialog.open({ 
                    template: 'templateId',
                    controller: ['$scope', '$cookies' , function($scope, $cookies) {
                        $scope.userinfo = $cookies.getObject('globals') || {};
                        $scope.show = true;
                        $scope.reserve = true;
                        //$scope.username = $scope.userinfo.currentUser.username;
                        $scope.email = $scope.userinfo.currentUser.email;
                        if ($scope.email == event.owner) {
                            $scope.show = false;
                        }
                        $scope.timeConverter = function(UNIX_timestamp){
                            var a = new Date(UNIX_timestamp);
                            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            var year = a.getFullYear();
                            var month = months[a.getMonth()];
                            var date = a.getDate();
                            var hour = a.getHours();
                            var minute = a.getMinutes();
                            var time = month + ' ' + date + ' ' +  year + '   ' + hour + ':' + minute;
                            return time;
                        }
                        event.starttime = $scope.timeConverter(event.time);
                        event.endtime = $scope.timeConverter(event.time + event.duration);
                        event.posttime = $scope.timeConverter(event.timeposted);
                        $scope.specevent = event;
                        console.log($scope.specevent);
                        if (event.latitude) {
                           $scope.mapurl="https://maps.googleapis.com/maps/api/staticmap?center=" + event.latitude + "," + event.longitude + 
                                    "&zoom=16&size=320x200&&markers=color:red%7Clabel:C%7C" + event.latitude + "," + event.longitude 
                                    + "&key=AIzaSyAFhzO5tGWXiCCtH5y6XW6ycS-1fbC4uYA";
                        } else {
                            $scope.mapurl="img/loc_404.png";
                        }

                        $scope.reserveEvent = function() {
                            $scope.reserve = false;
                        }

                        $scope.quitEvent = function() {
                            $scope.reserve = true;
                        }


                        
                        
                    }] 
                });
            }

        };


})();