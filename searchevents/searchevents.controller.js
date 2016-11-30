(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('SearcheventsController', SearcheventsController);

    SearcheventsController.$inject = ['$scope','$rootScope', '$location', 'FlashService', 'ngDialog', 'EventService'];
        function SearcheventsController($scope, $rootScope ,$location, FlashService, ngDialog, EventService) {

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
                if ($scope.canapply) {
                    $scope.$apply();
                    $scope.canapply = false;
                }



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
                        $scope.currentpage = 1;
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
                    $scope.updateevents(response);
                })

            }


            $scope.showspecificevent = function(id) {
				EventService.showspecificevent($scope, $rootScope, ngDialog, id);
			}

        };




})();
