(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('MyeventController', MyeventController);

    MyeventController.$inject = ['$scope','$rootScope', '$location', 'FlashService', 'ngDialog', 'EventService'];
        function MyeventController($scope, $rootScope,  $location, FlashService, ngDialog, EventService) {


            $("#bodyBackground").css('background', 'white');
            $scope.allevents = [];
            $scope.events;
            $scope.firstime = true;

            // pagination
            const MAXEVENTPERPAGE = 8;
            $scope.currentpage = 1;
            $scope.currentpage_attend = 1;
            $scope.maxpage;
            $scope.maxpage_attend;
            $scope.gotoPrevPage = function() {
                $scope.currentpage -= 1;
                $scope.updateevents($scope.events);
            }

            $scope.gotoNextPage = function() {
                $scope.currentpage += 1;
                $scope.updateevents($scope.events);
            }
            $scope.gotoPrevPage_attend = function() {
                $scope.currentpage_attend -= 1;
                $scope.updateevents_attend($scope.events_attend);
            }

            $scope.gotoNextPage_attend = function() {
                $scope.currentpage_attend += 1;
                $scope.updateevents_attend($scope.events_attend);
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
                console.log($scope.allevents);

            }

            $scope.updateevents_attend = function(eventlist) {
                var startpos = ($scope.currentpage_attend - 1) * MAXEVENTPERPAGE;
                var endpos = ($scope.currentpage_attend) * MAXEVENTPERPAGE;
                if (endpos > eventlist.length)
                    endpos = eventlist.length;
                for (var i = startpos; i < endpos; i++) {
                    eventlist[i].starttime = EventService.timeConverter(eventlist[i].time);
                    if (eventlist[i].images.length == 0) {
                        eventlist[i].eventimage = "assets/image-resources/stock-images/img-17.jpg";
                    } else {
                        eventlist[i].eventimage = "https://yakume.xyz/img/" + eventlist[i].images[0];
                    }
                }
                if ($scope.firstime) {
                    $scope.$apply();
                    $scope.firstime = false;
                }
                console.log(eventlist);
            }


            $scope.pull_all_events = function() {
                var mydata = $.param({
                });

                $.ajax({
                    type: "GET",
                    url: 'https://yakume.xyz/api/eventcreated',
                    data: mydata,
                    success: function(response){

                        $scope.events = JSON.parse(response).events;
                        $scope.maxpage = Math.ceil($scope.events.length/MAXEVENTPERPAGE);
                        $scope.sortbytime();
                    }
                });

                $scope.trc(function(){
                    $scope.events_attend = $rootScope.globals.event_attend;
                    //console.log($rootScope.globals.event_attend);
                    $scope.maxpage_attend = Math.ceil($scope.events_attend.length/MAXEVENTPERPAGE);
                    //console.log($scope.maxpage_attend);
                    //$scope.updateevents_attend($scope.events_attend);
                    $scope.sortbytime_attend();
                });
                //$scope.events_attend = $rootScope.globals.event_attend;
                //console.log($rootScope.event_attend);
                //$scope.maxpage_attend = Math.ceil($scope.events_attend.length/MAXEVENTPERPAGE);
		//console.log($scope.events_attend);
                //$scope.updateevents_attend($scope.events_attend);
            }

    	    $scope.trc = function(callback) {
        		$.ajax({
                    type: "GET",
                    url: 'https://yakume.xyz/api/myevents',
                    success: function(response){
                        console.log(response);
                        var events_attend_num = JSON.parse(response).events;
                        $scope.maxpage_attend = Math.ceil(events_attend_num.length/MAXEVENTPERPAGE);
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
                                    console.log(response);
				    if (response) {
					count++;
					//console.log(count);
				    }
                                    var t = JSON.parse(response);
                                    $rootScope.globals.event_attend.push(t);
                                    if (count == events_attend_num.length) {
					//console.log(count);
                    			callback();
                    		    }
                                }
                            });
                        })


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
                $scope.updateevents($scope.events);
                //console.log($scope.events);
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

            $scope.sortbyname_attend = function() {
                $scope.events_attend.sort(function(a,b){
                    return a.title.localeCompare(b.title);
                });
                $scope.updateevents_attend($scope.events_attend);
                //console.log($scope.events);
            }

            $scope.sortbypublish_attend = function() {
              $scope.events_attend.sort(function(a,b){
                  return parseInt(a.timeposted) - parseInt(b.timeposted);
              });
              $scope.updateevents_attend($scope.events_attend);
              //console.log($scope.events);
            }


            $scope.showspecificevent = function(id) {
				EventService.showspecificevent($scope, $rootScope, $location, ngDialog, id);
			}

        };


})();
