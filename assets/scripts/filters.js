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

//filters for portfolioApp module
angular.module('portfolioApp')
	.filter('showResultCount', [function() {
		return function(res) {
			if(typeof res != 'undefined') {
				var setSize = (res).length;
				if((setSize < 100) && (setSize > 0)) {
					return 'Result count is ' + setSize + '.';
				} else if(setSize >= 100) {
					return 'Result limited to 100.';
				} else {
					return '';
				};
			};
		};
	}])
	.filter('htmlWrap', [function() {
		//takes html and wraps it with the tag of class tagClass
		return function(html, tag, tagClass) {
			return '<' + tag + ' ' + 'class="' + tagClass + '">' + html + '</' + tag + '>';
		};
	}]);
