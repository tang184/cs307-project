(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$location', 'FlashService', '$cookies', '$rootScope', 'AuthenticationService' , '$state'];
    	function MainController($scope, $location, FlashService, $cookies, $rootScope, AuthenticationService, $state) {
            
        	$("#bodyBackground").css('background', 'white');
        	//$rootScope.globals = $cookies.getObject('globals') || {};
        	$scope.username = $rootScope.globals.currentUser.username;
        	$scope.image = "https://yakume.xyz/img/" + $rootScope.globals.currentUser.image;
        	//console.log($rootscope.globals);
	    	$.ajax({
                type: "GET",
                url: 'https://yakume.xyz/api/myevents',
                success: function(response){
                    console.log(response);
                    $rootScope.globals.myevents = JSON.parse(response).events;
                }
            });

        	$(document).ready(function() {

		    //pageTransitions();

		    // ADD SLIDEDOWN ANIMATION TO DROPDOWN //
			    $('.dropdown').on('show.bs.dropdown', function(e){
			        $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
			    });

			    // ADD SLIDEUP ANIMATION TO DROPDOWN //
			    $('.dropdown').on('hide.bs.dropdown', function(e){
			        $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
			    });

			    /* Sidebar menu */
			    $(function() {

			        $('#sidebar-menu').superclick({
			            animation: {
			                height: 'show'
			            },
			            animationOut: {
			                height: 'hide'
			            }
			        });

			        //automatically open the current path
			        var path = window.location.pathname.split('/');
			        path = path[path.length-1];
			        if (path !== undefined) {
			            $("#sidebar-menu").find("a[href$='" + path + "']").addClass('sfActive');
			            $("#sidebar-menu").find("a[href$='" + path + "']").parents().eq(3).superclick('show');
			        }

			    });

			    /* Colapse sidebar */
			    $(function() {
			        $('#close-sidebar').click(function() {
			            $('body').toggleClass('closed-sidebar');
			            $('.glyph-icon', this).toggleClass('icon-angle-right').toggleClass('icon-angle-left');
			        });

			        $('#hot_events').click(function() {
			            $('body').toggleClass('closed-sidebar');
			           	$('#abc').toggleClass('icon-angle-right').toggleClass('icon-angle-left');
			        });
			        $('#create_events').click(function() {
			            $('body').toggleClass('closed-sidebar');
			            $('#abc').toggleClass('icon-angle-right').toggleClass('icon-angle-left');
			        });
			        $('#your_events').click(function() {
			            $('body').toggleClass('closed-sidebar');
			            $('#abc').toggleClass('icon-angle-right').toggleClass('icon-angle-left');
			        });
			        $('#personal_profile').click(function() {
			            $('body').toggleClass('closed-sidebar');
			            $('#abc').toggleClass('icon-angle-right').toggleClass('icon-angle-left');
			        });
			        $('#nearby_events').click(function() {
			            $('body').toggleClass('closed-sidebar');
			            $('#abc').toggleClass('icon-angle-right').toggleClass('icon-angle-left');
			        });
			        $('#search_events').click(function() {
			            $('body').toggleClass('closed-sidebar');
			            $('#abc').toggleClass('icon-angle-right').toggleClass('icon-angle-left');
			        });
			        $('#search_user').click(function() {
			            $('body').toggleClass('closed-sidebar');
			            $('#abc').toggleClass('icon-angle-right').toggleClass('icon-angle-left');
			        });

			    });

    /* Sidebar scroll */


			});

			

			
			

			$scope.logout = function() {
			    AuthenticationService.Logout();
			}
                        $scope.edit_profile = function() {
                            
                            $location.path('/main/profile');
                            $state.go('profile');
                        }

        	

    	};




    	

})();
