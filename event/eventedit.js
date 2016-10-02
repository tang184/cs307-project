(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('EventEdit',EventEdit);

        EventEdit.$inject = ['$scope', '$location', 'FlashService'];
            function EventEdit($scope, $location, FlashService) {

                $("#bodyBackground").css('background', 'white');


        function EventEdit($scope) {
            $scope.create = true;

            $scope.test = function() {
                alert("test");
            }
        };


})();
