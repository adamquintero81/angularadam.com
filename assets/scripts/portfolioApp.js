//	AngularJS Portfolio App - 1.04b
//	Copyright (C) 2015  Adam M. Quintero
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

//dependencies, configuration, routing for portfolioApp module
angular.module('portfolioApp', ['ngRoute', 'ui.bootstrap', 'ngSanitize','aqScroller'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/', {
			templateUrl: 'assets/templates/home.html'
		})
		.when('/lookupApp', {
			templateUrl: 'assets/templates/dictionary.html',
			controller: 'LookupCtrl as mainCtrl'
		})
		.when('/referenceApp', {
			templateUrl: 'assets/templates/angularReference.html',
			controller: 'ReferenceCtrl as mainCtrl',
			reloadOnSearch: false
		})
		.otherwise({redirectTo: '/'});
	}]);
