(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$rootScope','$location', '$cookies','FlashService', 'ngDialog', 'EventService'];
        function DashboardController($scope, $rootScope, $location, $cookies, FlashService, ngDialog, EventService) {

            $("#bodyBackground").css('background', 'white');
            $scope.allevents = [];
	    $scope.allevents_attend = [];

            $scope.updateevents = function(eventlist) {
                for (var i = 0; i < 5; i++) {
                    eventlist[i].time = EventService.timeConverter(eventlist[i].time);
                    if (eventlist[i].images.length == 0) {
                        eventlist[i].eventimage = "assets/image-resources/stock-images/img-17.jpg";
                    } else {
                        eventlist[i].eventimage = "https://yakume.xyz/img/" + eventlist[i].images[0];
                    }
                    $scope.allevents.push(eventlist[i]);
                }
                //$scope.allevents = eventlist;
                $scope.$apply();
            }

            $scope.updateevents_attend = function(eventlist) {
                if ($scope.mymax > 5) {
                    $scope.mymax = 5;
                }
                for (var i = 0; i < $scope.mymax; i++) {
                    eventlist[i].starttime = EventService.timeConverter(eventlist[i].time);
                    if (eventlist[i].images.length == 0) {
                        eventlist[i].eventimage = "assets/image-resources/stock-images/img-17.jpg";
                    } else {
                        eventlist[i].eventimage = "https://yakume.xyz/img/" + eventlist[i].images[0];
                    }
                    $scope.allevents_attend.push(eventlist[i]);
                }
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
                        $scope.sortbytime();

                    }
                });

                $scope.trc(function(){
                    $scope.events_attend = $rootScope.globals.event_attend;

                    $scope.sortbytime_attend();
                });
            }


            

            $scope.trc = function(callback) {
                $.ajax({
                    type: "GET",
                    url: 'https://yakume.xyz/api/myevents',
                    success: function(response){
                        console.log(response);
                        var events_attend_num = JSON.parse(response).events;
                        $rootScope.globals.event_attend = [];
                        var count = 0;
                        $.each(events_attend_num, function (i, item) {
                            var mydata = $.param({
                                eventid : item
                            });
                            $.ajax({
                                type: "GET",
                                url: 'https://yakume.xyz/api/getevent',
                                data: mydata,
                                success: function(response){
                                    //console.log(response);
                                    if (response) {
                                        count++;
                                    //console.log(count);
                                    }
				                    $scope.mymax = events_attend_num.length;
                                    var t = JSON.parse(response);
                                    $rootScope.globals.event_attend.push(t);
                                    if (count == events_attend_num.length) {
					                    console.log($rootScope.globals.event_attend);
                                        callback();
                                    }
                                }
                            });
                        })
                    }
                });
            }

            $scope.sortbytime = function() {
                $scope.events.sort(function(a,b){
                  return parseInt(a.time) - parseInt(b.time);
                });
                var currtime = new Date().getTime();
                var len = $scope.events.length;
                var cnt = 0;
                var index = 0;
                while(cnt < len){
                    if($scope.events[cnt].time >= currtime){
                        break;
                    }
                    cnt++;
                }
                while(index < cnt){
                    var temp = $scope.events.shift();
                    $scope.events.push(temp);
                    index++;
                }
                $scope.currentpage = 1;
                $scope.updateevents($scope.events);
            }

            $scope.sortbytime_attend = function() {
                $scope.events_attend.sort(function(a,b){
                  return parseInt(a.time) - parseInt(b.time);
                });
                var currtime = new Date().getTime();
                var len = $scope.events_attend.length;
                var cnt = 0;
                var index = 0;
                while(cnt < len){
                    if($scope.events_attend[cnt].time >= currtime){
                        break;
                    }
                    cnt++;
                }
                while(index < cnt){
                    var temp = $scope.events_attend.shift();
                    $scope.events_attend.push(temp);
                    index++;
                }
                $scope.updateevents_attend($scope.events_attend);
            }

            $scope.pull_all_events();

            $scope.showspecificevent = function(id) {
				EventService.showspecificevent($scope, $rootScope, $location, ngDialog, id);
			}
    };


})();
