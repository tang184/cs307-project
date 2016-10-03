(function () {
    'use strict';

    angular
        .module('mainApp')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$location', 'FlashService'];
    	function MainController($scope, $location, FlashService) {    		
        	$("#bodyBackground").css('background', 'white');


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

			    });

    /* Sidebar scroll */


			});

			

			$scope.loadScript = function(url, type, charset) {
			    if (type===undefined) type = 'text/javascript';
			    if (url) {
			        var script = document.querySelector("script[src*='"+url+"']");
			        if (!script) {
			            var heads = document.getElementsByTagName("head");
			            if (heads && heads.length) {
			                var head = heads[0];
			                if (head) {
			                    script = document.createElement('script');
			                    script.setAttribute('src', url);
			                    script.setAttribute('type', type);
			                    if (charset) script.setAttribute('charset', charset);
			                    head.appendChild(script);
			                }
			            }
			        }
			        return script;
			    }
			}
			

			$scope.logout = function() {
				$location.path('/login');
			}

        	

    	};




    	

})();