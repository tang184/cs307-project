(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('MyeventController', MyeventController);

    MyeventController.$inject = ['$scope','$rootScope', '$location', 'FlashService', 'ngDialog'];
        function MyeventController($scope, $rootScope,  $location, FlashService, ngDialog) {


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
            $scope.timeConverter = function(UNIX_timestamp){
                  var a = new Date(UNIX_timestamp);
                  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  var year = a.getFullYear();
                  var month = months[a.getMonth()];
                  var date = a.getDate();
                  var time = month + ' ' + date + ' ' +  year;
                  return time;
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
                    $scope.allevents.push(eventlist[i]);
                }
                console.log($scope.allevents);
                if ($scope.firstime) {
                    $scope.$apply();
                    $scope.firstime = false;
                }

            }

            $scope.updateevents_attend = function(eventlist) {
                var startpos = ($scope.currentpage_attend - 1) * MAXEVENTPERPAGE;
                var endpos = ($scope.currentpage_attend) * MAXEVENTPERPAGE;
                if (endpos > eventlist.length)
                    endpos = eventlist.length;
                for (var i = startpos; i < endpos; i++) {
                    eventlist[i].starttime = $scope.timeConverter(eventlist[i].time);
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
                        $scope.updateevents($scope.events);
                        $scope.sortbytime();
                    }
                });

                $scope.trc(function(){
                    $scope.events_attend = $rootScope.globals.event_attend;
                    console.log($rootScope.globals.event_attend);
                    //$scope.maxpage_attend = Math.ceil($scope.events_attend.length/MAXEVENTPERPAGE);
                    console.log($scope.maxpage_attend);                                                     
                    $scope.updateevents_attend($scope.events_attend);
                    $scope.sortbytime();
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
                                    var t = JSON.parse(response);
                                    $rootScope.globals.event_attend.push(t);
                                    callback();
                                }
                            });
                        })


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
                        $scope.userinfo = $cookies.getObject('globals') || {};
                        $scope.show = true;
                        $scope.reserve = true;
                        $scope.email = $scope.userinfo.currentUser.email;
            			if ($rootScope.globals.currentUser.email == $scope.specevent.owner) {
                            $scope.show = false;
            			}

                        var mydata = $.param({
                            eventid : event.id
                        });

                        $.ajax({
                            type: "GET",
                            url: 'https://yakume.xyz/api/attendees',
                            data: mydata,
                            success: function(response) {
                                console.log(response);
                                //$scope.attendees = JSON.parse(response); 
                                //console.log(attendees);
                            }
                        });

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
                                    console.log(response);

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
                                    console.log(response);
                                }
                            });
                        }

                        $scope.Follow = function(id) {
                            $scope.follow = true;
                            var mydata = $.param({
                                email : id
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

                        $scope.unFollow = function(id) {
                            $scope.follow = false;
                            var mydata = $.param({
                                email : id
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

                    }]
                });
            })
        }



        };


})();
