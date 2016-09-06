(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$location', 'FlashService'];
    	function MainController($scope, $location, FlashService) {    		
        	$("#bodyBackground").css('background', 'white');
    	};

})();