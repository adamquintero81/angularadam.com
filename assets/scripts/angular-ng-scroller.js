//	Version 1.0
//	aqScroller- Smooth Automatic Scrolling to HTML Elements
//	Copyright (C) 2015  Adam M. Quintero
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

//  Adapted from ngSmoothScroll @ https://github.com/d-oliveros/ngSmoothScroll

angular.module('aqScroller', [])
	.factory('ScrollService', ['$window', '$document','$log', function($window, $document, $log) {
		//ScrollService is used like a class for a
		//Singleton object for code that don't need to be
		//instantiated for every element, only once per app load
		
		//private functions
		
		var isFunction = function(f) {
			$log.debug('is a function', typeof(f) == 'function');
			return typeof(f) == 'function';
		}
		
		return {
			//public functions
			
			//returns the current scroll location of the browser window
			getScrollLocation: function () {
				return $window.pageYOffset ? $window.pageYOffset : $document[0].documentElement.scrollTop;
			},
			//calculate the easing pattern
			easingPattern: function(type, time) {
				// accelerating from zero velocity
				if ( type == 'easeInQuad' ) return time * time;
				// decelerating to zero velocity
				if ( type == 'easeOutQuad' ) return time * (2 - time); 
				// acceleration until halfway, then deceleration
				if ( type == 'easeInOutQuad' ) return time < 0.5 ? 2 * time * time : -1 + (4 - 2 * time) * time;
				// accelerating from zero velocity				
				if ( type == 'easeInCubic' ) return time * time * time; 
				// decelerating to zero velocity
				if ( type == 'easeOutCubic' ) return (--time) * time * time + 1; 
				// acceleration until halfway, then deceleration
				if ( type == 'easeInOutCubic' ) return time < 0.5 ? 4 * time * time * time : (time - 1) * (2 * time - 2) * (2 * time - 2) + 1; 
				// accelerating from zero velocity
				if ( type == 'easeInQuart' ) return time * time * time * time; 
				// decelerating to zero velocity
				if ( type == 'easeOutQuart' ) return 1 - (--time) * time * time * time; 
				 // acceleration until halfway, then deceleration
				if ( type == 'easeInOutQuart' ) return time < 0.5 ? 8 * time * time * time * time : 1 - 8 * (--time) * time * time * time;
				// accelerating from zero velocity
				if ( type == 'easeInQuint' ) return time * time * time * time * time; 
				// decelerating to zero velocity
				if ( type == 'easeOutQuint' ) return 1 + (--time) * time * time * time * time; 
				// acceleration until halfway, then deceleration
				if ( type == 'easeInOutQuint' ) return time < 0.5 ? 16 * time * time * time * time * time : 1 + 16 * (--time) * time * time * time * time; 
				// else default: no easing, no acceleration
				return time; 
			},
			//calculate how far to scroll
			getEndLocation: function(el, offset) {
				var location = 0;
				if (el.offsetParent) {
					do {
						location += el.offsetTop;
						el = el.offsetParent;
					} while (el);
				}
				location = Math.max(location - offset, 0);
				return location;
			},
			//stop the scrolling animation when the anchor is reached (or at the top/bottom of the page)
			stopAnimation: function(currentLocation, position, endLocation) {
				if ( position == endLocation || currentLocation == endLocation || ( ($window.innerHeight + currentLocation) >= $document[0].body.scrollHeight ) ) {
					return true;
				} else {
					return false;
				}
			}
		};
}])
	.directive('ngScroller', ['ScrollService', '$window', '$document', '$timeout', '$interval', '$log', function(ScrollService, $window, $document, $timeout, $interval, $log) {
		return {
			restrict: 'A',
			link: function($scope, $elem, $attrs) {	
				
				//scroll to target element when this element is clicked
				$elem.on('click', function (clickEvent) {
					//store this element
					var element = $elem[0];

					//only scroll on click if onLoad scrolling is turned off.				
						//check for user defined options
						var options = {};
						if (typeof $attrs.scrollerDuration != 'undefined')
							options.duration = $attrs.scrollerDuration;
						if (typeof $attrs.scrollerOffset != 'undefined')
							options.offset = $attrs.scrollerOffset;
						if (typeof $attrs.scrollerEasing != 'undefined')
							options.easing = $attrs.scrollerEasing;
						if (typeof $attrs.scrollerIf != 'undefined')
							options.scrollerIf = $attrs.scrollerIf;
						if (typeof $attrs.scrollerTo != 'undefined') {
							var targetElement = $document[0].getElementById($attrs.scrollerTo);
							if(typeof targetElement != 'undefined')
								options.scrollerTo = targetElement;
						}
						//set user defined options or default
						var duration = options.duration || 800;
						var	offset = options.offset || 0;
						var	easing = options.easing || 'easeInOutQuart';
						var scrollerIf = options.scrollerIf || 'true';
						var scrollTo = options.scrollerTo || element;
						
						//set startLocation for scroll
						var startLocation = $window.pageYOffset;
						//set the endLocation for scroll
						var endLocation = ScrollService.getEndLocation(scrollTo, offset);
						//calculate total distance to scroll
						var distance = endLocation - startLocation;	
						//initialize timeLapsed to zero
						var timeLapsed = 0;
						//declare percentage
						var percentage;
						//declare position
						var position;
																
						//user scroll during animation checks
						var scrollableElements = angular.element([$document[0], $window]);
						var userScrollListener = function (e) {
							$interval.cancel(runAnimation);
							scrollableElements.off('wheel', userScrollListener);
						}
						scrollableElements.on('wheel', userScrollListener);
						
						//scroll the page by an increment, and check if it's time to stop
						var animateScroll = function () {
							timeLapsed += 16;
							percentage = ( timeLapsed / duration );
							percentage = ( percentage > 1 ) ? 1 : percentage;
							position = startLocation + ( distance * ScrollService.easingPattern(easing, percentage) );
							$window.scrollTo( 0, position );
							var currentLocation = ScrollService.getScrollLocation();
							if(ScrollService.stopAnimation(currentLocation, position, endLocation)) {
								scrollableElements.off('wheel', userScrollListener);
								$interval.cancel(runAnimation);
							}
						};
												
						//carry out scrolling if scrolling turned on
						if(scrollerIf === 'true')
							var runAnimation = $interval(animateScroll, 16);
					
				});
			}
		};
}]);