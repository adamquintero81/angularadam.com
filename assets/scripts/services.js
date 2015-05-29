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

//Services for portfolioApp module
angular.module('portfolioApp')
	.factory('DictService', ['$http',function($http) {
		
		return {
			//public function: runs query using current filters
			query: function (filterData) {
				var config = {
					method: 'GET',
					url: '/assets/scripts/getwords.php',
					params: {filter1: filterData.word, filter2: filterData.def},
					cache: true
				};
				return $http(config);
			}
		};
	}])
	.factory('RefService', ['$http', '$document', function($http, $document) {
		//variable holds selected topicID
		var selectedTopicID = 0;
		//default routing value for topic filter
		var topicFilter = 'nofilter';
		var screenPosition = 0;
		return {
			//public function: returns promise with all id,topics,keywords
			queryTopics: function () {
				var config = {
					method: 'GET',
					url: 'assets/scripts/getTopics.php',
					cache: true
				};
				return $http(config);
			},
			//public function: returns promise with id,note
			queryNote: function (id) {
				var config = {
					method: 'GET',
					url: 'assets/scripts/getNote.php',
					params: {filter1: id},
					cache: true
				};
				return $http(config);
			},
			getSelectedTopic: function () {
				return selectedTopicID;
			},
			pushSelectedTopic: function(topicID) {
				selectedTopicID = topicID;
			},
			getTopicFilter: function () {
				return topicFilter;
			},
			pushTopicFilter: function(filter) {
				if(filter === '') {
					topicFilter = 'nofilter';
				} else {
					topicFilter = filter;
				};
			}
		};
}]);