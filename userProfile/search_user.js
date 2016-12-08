(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('SearchuserController', SearchuserController);

    SearchuserController.$inject = ['$scope','$rootScope', '$location', 'FlashService', 'ngDialog', 'EventService'];
        function SearchuserController($scope, $rootScope ,$location, FlashService, ngDialog, EventService) {

            $scope.search = function() {
                var mydata = $.param({
                    keyword : $scope.key
                });
				
                $.ajax({
                    type: "GET",
                    url: 'https://yakume.xyz/api/event/search',
                    data: mydata,
                    success: function(response){

                    }
                });
            }

        };




})();
