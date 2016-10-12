(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('HoteventController', HoteventController);

    HoteventControllerController.$inject = ['$scope', '$location', 'FlashService'];
        function HoteventController($scope, $location, FlashService) {
            
            $("#bodyBackground").css('background', 'white');
            $scope.allevents = []

            $scope.updateevents = function(eventlist) {
                $scope.allevents = eventlist;
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
                        var events = JSON.parse(response).events;
                        $scope.updateevents(events);
                    }
                });
            }

            $scope.view_event = function(id) {
                alert("viewevent".concat(id.toString()));
            }

            $scope.pull_all_events();
            

        };


})();