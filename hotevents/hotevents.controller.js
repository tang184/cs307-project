(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('HoteventController', HoteventController);

    HoteventController.$inject = ['$scope','$rootScope', '$location', 'FlashService', 'ngDialog'];
        function HoteventController($scope, $rootScope ,$location, FlashService, ngDialog) {


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
                    eventlist[i].starttime = $scope.timeConverter(eventlist[i].time);
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

                        $scope.events = JSON.parse(response).events;
                        $scope.maxpage = Math.ceil($scope.events.length/MAXEVENTPERPAGE);
                        $scope.updateevents($scope.events);
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

            $scope.timeConverter = function(UNIX_timestamp){
                  var a = new Date(UNIX_timestamp);
                  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  var year = a.getFullYear();
                  var month = months[a.getMonth()];
                  var date = a.getDate();
                  var time = month + ' ' + date + ' ' +  year;
                  return time;
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
                    if ($rootScope.globals.currentUser.email == $scope.specevent.owner) {
                        $scope.show = false;
                    }
                    $scope.specevent.mapurl="img/loc_404.png";

                    $scope.abc = "owner";
                    $scope.specevent.starttime = $scope.timeConverter($scope.specevent.time);
                    $scope.specevent.endtime = $scope.timeConverter($scope.specevent.time + $scope.specevent.duration);
                    $scope.specevent.posttime = $scope.timeConverter($scope.specevent.timeposted);
                    //$scope.specevent = event;
                    //console.log($scope.specevent);
                    if ($scope.specevent.latitude) {
                       $scope.specevent.mapurl="https://maps.googleapis.com/maps/api/staticmap?center=" + $scope.specevent.latitude + "," + $scope.specevent.longitude +
                                "&zoom=16&size=320x200&&markers=color:red%7Clabel:C%7C" + $scope.specevent.latitude + "," + $scope.specevent.longitude
                                + "&key=AIzaSyAFhzO5tGWXiCCtH5y6XW6ycS-1fbC4uYA";
                        console.log($scope.specevent.mapurl);
                    } else {
                        $scope.specevent.mapurl="img/loc_404.png";
                    }
                    event = $scope.specevent;
                    console.log(event);
                    ngDialog.open({
                    template: 'templateId',
                    controller: ['$scope', '$cookies' , function($scope, $cookies) {
                        $scope.specevent = event;
                        $scope.show = true;
                        $scope.save = true;
                        //$scope.reserve = true;
                        if ($rootScope.globals.currentUser.email == $scope.specevent.owner) {
                            $scope.show = false;
                        }
                        $scope.sattend = false;


                        var mydata = $.param({
                            eventid : event.id
                        });

                        $.ajax({
                            type: "GET",
                            url: 'https://yakume.xyz/api/attendees',
                            data: mydata,
                            success: function(response) {
                                $scope.attendees = JSON.parse(response).attendees;
                                console.log($scope.attendees);
                                $scope.reserve = !($.inArray($rootScope.globals.currentUser.email, $scope.attendees) > -1);
                                //console.log($scope.reserve);
                                $scope.$apply();
                            }
                        });
                        $scope.sowner = false;
                        $scope.showownerinfo = function() {
                            $scope.sowner = !$scope.sowner;
                        }

                        $scope.showattend = function() {
                            $scope.sattend = !$scope.sattend;
                        }

                        $scope.timeConverter = function(UNIX_timestamp) {
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

                        $scope.saveEvent = function(id) {
                            $scope.save = false;
                            var mydata = $.param({
                                eventid : id
                            });

                            $.ajax({
                                type: "POST",
                                url: 'https://yakume.xyz/api/watchlist/save',
                                data: mydata,
                                success: function(response){
                                    if (response == "SUCCESS") {
                                        console.log("saved to watchlist!");
                                    }
                                }
                            });
                        }

                        $scope.unsaveEvent = function(id) {
                            $scope.save = true;
                            var mydata = $.param({
                                eventid : id
                            });

                            $.ajax({
                                type: "POST",
                                url: 'https://yakume.xyz/api/watchlist/delete',
                                data: mydata,
                                success: function(response){
                                    if (response == "SUCCESS") {
                                        console.log("unsaved from watchlist!");
                                    }
                                }
                            });
                        }

                        $scope.reserveEvent = function(id) {
                            $scope.reserve = false;
                            var mydata = $.param({
                                eventid : id
                            });

                            $.ajax({
                                type: "POST",
                                url: 'https://yakume.xyz/api/event/register',
                                data: mydata,
                                success: function(response){
                                    if (response == "SUCCESS") {
                                        $scope.attendees.push($rootScope.globals.currentUser.email);
                                    }
                                    console.log($scope.attendees);
                                }
                            });
                        }

                        $scope.quitEvent = function(id) {
                            $scope.reserve = true;
                            var mydata = $.param({
                                eventid : id
                            });

                            $.ajax({
                                type: "POST",
                                url: 'https://yakume.xyz/api/event/unregister',
                                data: mydata,
                                success: function(response){
                                    if (response == "SUCCESS") {
                                        for(var i = $scope.attendees.length - 1; i >= 0; i--) {
                                            if($scope.attendees[i] === $rootScope.globals.currentUser.email) {
                                               $scope.attendees.splice(i, 1);
                                            }
                                        }
                                        console.log($scope.attendees);
                                    }
                                }
                            });
                        }

                        $scope.Follow = function() {
                            $scope.follow = true;
                            var mydata = $.param({
                                email : $rootScope.globals.currentUser.email
                            });

                            $.ajax({
                                type: "POST",
                                url: 'https://yakume.xyz/api/user/follow',
                                data: mydata,
                                success: function(response){
                                    console.log(response);
                                }
                            });
                        }

                        $scope.unFollow = function() {
                            $scope.follow = false;
                            var mydata = $.param({
                                email : $rootScope.globals.currentUser.email
                            });

                            $.ajax({
                                type: "POST",
                                url: 'https://yakume.xyz/api/user/unfollow',
                                data: mydata,
                                success: function(response){
                                    console.log(response);
                                }
                            });
                        }

                        $scope.deleteEvent = function(id) {
                            var mydata = $.param({
                                eventid : id
                            });

                            $.ajax({
                                type: "POST",
                                url: 'https://yakume.xyz/api/deleteevent',
                                data: mydata,
                                success: function(response){
                                    console.log(response);
                                }
                            });
                        }



                    }]
                });
            })
        }







        };




})();
