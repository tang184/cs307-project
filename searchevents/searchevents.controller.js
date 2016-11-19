(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('SearcheventsController', SearcheventsController);

    SearcheventsController.$inject = ['$scope','$rootScope', '$location', 'FlashService', 'ngDialog'];
        function SearcheventsController($scope, $rootScope ,$location, FlashService, ngDialog) {

            $("#bodyBackground").css('background', 'white');
            $scope.allevents = [];
            $scope.events;
            $scope.firstime = true;

            // pagination
            const MAXEVENTPERPAGE = 8;
            $scope.currentpage = 1;
            $scope.maxpage;

            $scope.advance = false;

            $scope.showadvance = function() {
                $scope.advance = !$scope.advance;
            }

            $scope.gotoPrevPage = function() {
                $scope.currentpage -= 1;
                $scope.update($scope.events);
            }

            $scope.gotoNextPage = function() {
                $scope.currentpage += 1;
                $scope.update($scope.events);
            }


            $scope.update = function(eventlist) {
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
                if ($scope.canapply) {
                    $scope.$apply();
                    $scope.canapply = false;
                }



            }




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
            $scope.canapply = false;

            $scope.search = function(callback) {
                $scope.canapply = true;
                $scope.allevents = [];
                var mydata;
                if (!$scope.zip) {
                    $scope.zip = 0;
                }

                if ($scope.advance) {
                    mydata= $.param({
                        keyword : $scope.key,
                        zipcode : $scope.zip,
                        tag : $scope.tag
                    });
                } else {
                    mydata= $.param({
                        keyword : $scope.key,
                    });
                }



                $.ajax({
                    type: "GET",
                    url: 'https://yakume.xyz/api/event/search',
                    data: mydata,
                    success: function(response){
                        var arr = JSON.parse(response).events;
                        $scope.searchResult = [];
                        $.each(arr, function (i, item) {
                            var mydata = $.param({
                                eventid : item
                            });
                            $.ajax({
                                type: "GET",
                                url: 'https://yakume.xyz/api/getevent',
                                data: mydata,
                                success: function(response){
                                    var t = JSON.parse(response);
                                    $scope.searchResult.push(t);
                                    if (i == arr.length - 1) {
                                        callback($scope.searchResult);
                                    }
                                }
                            });

                        })


                    }
                });
            }
            $scope.showresult = false;

            $scope.searchevent = function() {
                $scope.showresult = true;
                $scope.search(function(response) {
                    $scope.maxpage = Math.ceil(response.length/MAXEVENTPERPAGE);
                    $scope.events = response;
                    $scope.update(response);
                })

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
                                    } else if (response == "ERR_INVALID_ARGUMENT") {
                                        alert("You haven't pay");
                                    } else if (response == "ERR_NOT_LOGGED_IN") {
                                        alert(“login expired, please login again”);
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
