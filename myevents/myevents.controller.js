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


            $scope.showspecificevent = function(id) {
                var mydata = $.param({
                    eventid : id
                });
                function abc (callback) {
                    $.ajax({
                        type: "GET",
                        url: 'https://yakume.xyz/api/getevent',
                        data: mydata,
                        success: function(response){
                            
                            callback(response);

                        }
                    });
                }
                var event;
                abc(function(response) {
                    $scope.specevent = JSON.parse(response);
                    if ($scope.email == $scope.specevent.owner) {
                        $scope.show = false;
                    }
                    $scope.abc = "owner";
                    $scope.specevent.starttime = $scope.timeConverter($scope.specevent.time);
                    $scope.specevent.endtime = $scope.timeConverter($scope.specevent.time + $scope.specevent.duration);
                    $scope.specevent.posttime = $scope.timeConverter($scope.specevent.timeposted);
                    //$scope.specevent = event;
                    //console.log($scope.specevent);
                    if ($scope.specevent.latitude) {
                       $scope.mapurl="https://maps.googleapis.com/maps/api/staticmap?center=" + $scope.specevent.latitude + "," + $scope.specevent.longitude +
                                "&zoom=16&size=320x200&&markers=color:red%7Clabel:C%7C" + $scope.specevent.latitude + "," + $scope.specevent.longitude
                                + "&key=AIzaSyAFhzO5tGWXiCCtH5y6XW6ycS-1fbC4uYA";
                    } else {
                        $scope.mapurl="img/loc_404.png";
                    }
                    event = $scope.specevent;
                    console.log(event);
                    ngDialog.open({
                    template: 'templateId',
                    controller: ['$scope', '$cookies' , function($scope, $cookies) {
                        $scope.specevent = event;                        
                        $scope.userinfo = $cookies.getObject('globals') || {};
                        $scope.show = true;
                        $scope.reserve = true;
                        $scope.email = $scope.userinfo.currentUser.email;
                        
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
                        $scope.mapurl="img/loc_404.png";
           
                        $scope.reserveEvent = function() {
                            $scope.reserve = false;
                        }

                        $scope.quitEvent = function() {
                            $scope.reserve = true;
                        }




                        }]
                    });
                })

                
            }


        };


})();
