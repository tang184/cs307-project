(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('HoteventController', HoteventController);

    HoteventController.$inject = ['$scope', '$location', 'FlashService', 'ngDialog'];
        function HoteventController($scope, $location, FlashService, ngDialog) {


            $("#bodyBackground").css('background', 'white');
            $scope.allevents = [];
            $scope.events;
            $scope.firstime = true;

            $scope.updateevents = function(eventlist) {
                $scope.allevents = [];
                for (var i = 0; i < eventlist.length; i++) {
                    eventlist[i].starttime = $scope.timeConverter(eventlist[i].time);
                    $scope.allevents.push(eventlist[i]);
                }
                if ($scope.firstime) {
                    $scope.$apply();
                    $scope.firstime = false;
                }         

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


            $scope.pull_all_events();

            $scope.sortbytime = function() {
                $scope.events.sort(function(a,b){
                  return parseInt(b.time) - parseInt(a.time);
                });
                $scope.updateevents($scope.events);
                //console.log($scope.events);
            }

            $scope.sortbyname = function() {
				$scope.events.sort(function(a,b){
                    return a.title.localeCompare(b.title);
				});
				$scope.updateevents($scope.events);
                //console.log($scope.events);
            }

            $scope.sortbypublish = function() {
              $scope.events.sort(function(a,b){
                  return parseInt(a.timeposted) - parseInt(b.timeposted);
              });
              $scope.updateevents($scope.events);
              //console.log($scope.events);
            }

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
                    controller: ['$scope', function($scope) {

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


                        
                        
                    }] 
                });
            }

            


        };

        


})();
