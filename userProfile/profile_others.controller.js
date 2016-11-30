(function () {
    'use strict';
    angular
        .module('mainApp')
        .controller('ProfileOthersController', ProfileOthersController);

    ProfileOthersController.$inject = ['$scope', '$rootScope','$location','$cookies', 'FlashService', 'AuthenticationService', 'EventService'];
    function ProfileOthersController($scope, $rootScope, $location, $cookies, FlashService, AuthenticationService, EventService) {
		console.log("Profile Controller Init.");


	}

})();