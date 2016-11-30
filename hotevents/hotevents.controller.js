(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('HoteventController', HoteventController);

    HoteventController.$inject = ['$scope','$rootScope', '$location', 'FlashService', 'ngDialog', 'EventService'];
        function HoteventController($scope, $rootScope ,$location, FlashService, ngDialog, EventService) {


            $("#bodyBackground").css('background', 'white');
            $scope.allevents = [];
            $scope.events;
            $scope.firstime = true;
            // pagination
            const MAXEVENTPERPAGE = 8;
            $scope.currentpage = 1;
            $scope.maxpage;

            $scope.gotoPrevPage = function() {
                $scope.currentpage -= 1;
                $scope.updateevents($scope.events);
            }

            $scope.gotoNextPage = function() {
                $scope.currentpage += 1;
                $scope.updateevents($scope.events);
            }

            $scope.updateevents = function(eventlist) {
                $scope.allevents = [];
                var startpos = ($scope.currentpage - 1) * MAXEVENTPERPAGE;
                var endpos = ($scope.currentpage) * MAXEVENTPERPAGE;
                if (endpos > eventlist.length)
                    endpos = eventlist.length;
                for (var i = startpos; i < endpos; i++) {
		    //console.log(eventlist[i]);
                    eventlist[i].starttime = EventService.timeConverter(eventlist[i].time);
                    if (eventlist[i].images.length == 0) {
                        eventlist[i].eventimage = "assets/image-resources/stock-images/img-17.jpg";
                    } else {
                        eventlist[i].eventimage = "https://yakume.xyz/img/" + eventlist[i].images[0];
                    }
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

                            $scope.events= JSON.parse(response).events;
                            $scope.maxpage = Math.ceil($scope.events.length/MAXEVENTPERPAGE);
                            $scope.sortbytime();

                    }
                });
            }



            $scope.pull_all_events();

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
                //console.log($scope.events);
            }

            $scope.sortbyname = function() {
				$scope.events.sort(function(a,b){
                    return b.title.localeCompare(a.title);
				});
                var currtime = new Date().getTime();
                var len = $scope.events.length;
                var cnt = 0;
                var index = 0;
                var newevnt = new Array();
                while(cnt < len){
                    if($scope.events[cnt].time >= currtime){
                        newevnt.unshift($scope.events[cnt]);
                    } else {
                        newevnt.push($scope.events[cnt]);
                    }
                    cnt++;
                }
                //console.log(newevnt);
                $scope.events = newevnt;
                $scope.currentpage = 1;
                $scope.updateevents($scope.events);
                //console.log($scope.events);
            }

            $scope.sortbypublish = function() {
                $scope.events.sort(function(a,b){
                  return parseInt(a.timeposted) - parseInt(b.timeposted);
                });
                var currtime = new Date().getTime();
                var len = $scope.events.length;
                var cnt = 0;
                var index = 0;
                var newevnt = new Array();
                while(cnt < len){
                    if($scope.events[cnt].time >= currtime){
                        newevnt.unshift($scope.events[cnt]);
                    } else {
                        newevnt.push($scope.events[cnt]);
                    }
                    cnt++;
                }
                //console.log(newevnt);
                $scope.events = newevnt;
                $scope.currentpage = 1;
                $scope.updateevents($scope.events);
                //console.log($scope.events);
            }

            $scope.showspecificevent = function(id) {
				EventService.showspecificevent($scope, $rootScope, ngDialog, id);
			}







        };




})();
