(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$location'];
    function LoginController($location) {
        $("#bodyBackground").css('background-image', 'url(../assets/image-resources/blurred-bg/blurred-bg-3.jpg)');
    	};

})();




