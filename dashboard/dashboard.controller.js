(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('DashboardController', DashboardController);

    DashboardController.$inject = ['$scope', '$rootScope','$location', '$cookies','FlashService', 'ngDialog'];
        function DashboardController($scope, $rootScope, $location, $cookies, FlashService, ngDialog) {

            $("#bodyBackground").css('background', 'white');
            $scope.allevents = [];

            $scope.updateevents = function(eventlist) {
                for (var i = 0; i < 5; i++) {
                    eventlist[i].time = $scope.timeConverter(eventlist[i].time);
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
                for (var i = 0; i < 5; i++) {
                    eventlist[i].starttime = $scope.timeConverter(eventlist[i].time);
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
                var len = $scope.events.length;
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

            $scope.timeConverter = function(UNIX_timestamp){
                  var a = new Date(UNIX_timestamp);
                  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                  var year = a.getFullYear();
                  var month = months[a.getMonth()];
                  var date = a.getDate();
                  var time = month + ' ' + date + ' ' +  year;
                  return time;
            }

            $scope.DetailTimeConverter = function(UNIX_timestamp) {
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
                    $scope.specevent.starttime = $scope.DetailTimeConverter($scope.specevent.time);
                    $scope.specevent.endtime = $scope.DetailTimeConverter($scope.specevent.time + $scope.specevent.duration);
                    $scope.specevent.posttime = $scope.DetailTimeConverter($scope.specevent.timeposted);
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
                        $scope.reserve = true;
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
                                //console.log($scope.attendees);
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
                                    }else if (response == "ERR_NOT_LOGGED_IN"){
                                        alert("login expired, please login again");
                                        $location.path('/login');
                                    } else {
                                        alert(response);
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
                                    } else if (response == "ERR_NOT_LOGGED_IN"){
                                        alert("login expired, please login again");
                                        $location.path('/login');
                                    } else {
                                        alert(response);
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
                                    } else if (response == "ERR_INVALID_ARGUMENT") {
                                        alert("You haven't pay");
                                    } else if (response == "ERR_NOT_LOGGED_IN") {
                                        alert("login expired, please login again");
                                        $location.path('/login'); 
                                    } else {
                                        alert(response);
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
                                    } else if (response == "ERR_NOT_LOGGED_IN"){
                                        alert("login expired, please login again");
                                        $location.path('/login');
                                    } else {
                                        alert(response);
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
                                            

                                    if (response == "SUCCESS") {
                                        console.log(response);
                                    } else if (response == "ERR_NOT_LOGGED_IN"){
                                        alert("login expired, please login again");
                                        $location.path('/login');
                                    } else {
                                        alert(response);
                                    }




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

                                    if (response == "SUCCESS") {
                                        console.log(response);
                                    } else if (response == "ERR_NOT_LOGGED_IN"){
                                        alert("login expired, please login again");
                                        $location.path('/login');
                                    } else {
                                        alert(response);
                                    }

                                    
                                    
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

                                    if (response == "SUCCESS") {
                                        console.log(response);
                                    } else if (response == "ERR_NOT_LOGGED_IN"){
                                        alert("login expired, please login again");
                                        $location.path('/login');
                                    } else {
                                        alert(response);
                                    }

                                    
                                }
                            });
                        }



                    }]
                });
            })
        }
    };


})();
