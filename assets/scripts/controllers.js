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

angular.module('portfolioApp')
	.controller('NavCtrl', ['RefService', '$location', function(RefService, $location) {
		var self = this;
		self.navCollapse = false;
		//set link to referenceApp
		self.refAppLink = function() {
			$location.path('/referenceApp');
			$location.search('topic' , RefService.getSelectedTopic());
			$location.search('filter' , RefService.getTopicFilter());
		};
		
		//toggle navbar dropdown
		self.toggleCollapse = function () {
			self.navCollapse = !self.navCollapse;
		};
		
		//set class
		//set class
		self.toggleClass = function () {
			if(!self.navCollapse)
			{
				return !self.navCollapse;
			}else{
				return 'in';
			}
		}
	}])
	.controller('FooterCtrl', [ '$scope', function($scope) {
		var self = this;
		self.fCollapsed = false;
		//set button active state
		self.setActive = function () {
			if(self.fCollapsed){
				return "blur";
			}
		};
		//toggle collapse
		self.toggleCollapse = function () {
			self.fCollapsed = !self.fCollapsed;
		}
		//set class
		self.toggleClass = function () {
			if(!self.fCollapsed)
			{
				return !self.fCollapsed;
			}else{
				return 'in';
			}
		}
	}])
	.controller('LookupCtrl', ['DictService', function(DictService) {
		var self = this;
		
		//no records message
		self.noRecords = 'No records found.';
		
		//object to hold filters
		self.filters = {
			word: '',
			def: ''
		};
		//get an initial list of words
		DictService.query(self.filters).success(function(resp) {
			self.results = resp.records;
		});
		//query button press event
		self.filterQuery = function () {
			self.results = DictService.query(self.filters)
			.success(function(response) {
				self.results = response.records;
			})
			.error(function(errResponse) {
				console.log('Query Error');
				console.log(errResponse);
			});
		};		
	}])	
	.controller('ReferenceCtrl', ['RefService', '$location', '$routeParams', '$log', function(RefService, $location, $routeParams, $log) {
		var self = this;

		//abstract function to set key and value over an array of objects
		var setAll = function(arrayOfObjects, key, value) {
			if(typeof(arrayOfObjects) == 'undefined'){
				arrayOfObjects = [];
			}
			for(var i = 0; i < arrayOfObjects.length; i++) {
				arrayOfObjects[i][key] = value;
			}
			return arrayOfObjects;
		}

		//function to update browser bar
		var updateUrl = function (id) {
			//reset routed topic id
			RefService.pushSelectedTopic(id);
			//reset routing topic filter
			RefService.pushTopicFilter(self.search.Keywords);

			//update browser search with topic id and filter
			$location.search('topic' , RefService.getSelectedTopic());
			$location.search('filter' , RefService.getTopicFilter());
		}
		
		//function to help set all show bools to false
		var allTopicsFalse = function() {
			//set all topics to not highlight
			self.topicResults = setAll(self.topicResults, 'highlightTopic', false);
			//set all descriptions to not show
			self.topicResults = setAll(self.topicResults, 'showDesc', false);
			//set all notes to not show
			self.topicResults = setAll(self.topicResults, 'showNote', false);
		}
		
		//initialize topic filter from search
		if($location.search().filter != 'nofilter'){
			self.search = {Keywords: $location.search().filter};
		} else {
			self.search = {Keywords: ''};
		}
		
		//init topicresults
		self.topicResults = [];

		//initialize topics from server data
		RefService.queryTopics().success(function(resp) {
			//get searched topic
			var id = $location.search().topic;
			//set all topics,descriptions,notes to not show
			allTopicsFalse();
			//copy json data to topicResults
			self.topicResults = resp.records;
			
			//if routed to a valid id
			if(id > 0) {
				//select topic related by routed id
				for (var i = 0; i < self.topicResults.length; i++) {
					//if topic found
					if(self.topicResults[i].ID === parseInt(id)) {
						//highlight title
						self.topicResults[i].highlightTopic = true;
						//show desc
						self.topicResults[i].showDesc = true;
					}
				}
			}
		});
				
		//returns message to display results count
		self.showResultCount = function(count) {
			if(typeof(self.topicResults) != 'undefined') {
				return 'Search keyword found ' + count + ' of ' + self.topicResults.length + ' topics.';
			}
		}
				
		//fetches a note data from server
		var queryNote = function (id) {
			//query note data
			RefService.queryNote(id).success(function(resp) {
				//select topic related to note by id
				for (var i = 0; i < self.topicResults.length; i++) {
					//if related topic found
					if (self.topicResults[i].ID === parseInt(id)) {
						//append new data to topicResults at array position
						self.topicResults[i].Note = resp.records[0].Note;
					}
				}
			});
		}
			
		//topic click event
		self.topicClick = function (id) {
			//find the topic clicked by it's ID property
			for (var i = 0; i < self.topicResults.length; i++){
				//if topic found
				if(self.topicResults[i].ID === parseInt(id)){
					//get show state
					var state = self.topicResults[i].showDesc
					//hide all
					allTopicsFalse();
					//toggle current topic highlight
					self.topicResults[i].highlightTopic = !state;
					//toggle current description show
					self.topicResults[i].showDesc = !state;
					//hide note
					self.topicResults[i].showNote = false;
					//update url
					updateUrl(id);
				}
			}
		}
		
		//description click event
		self.descClick = function (id) {
			//select topic note data by topic id
			for (var i = 0; i < self.topicResults.length; i++){
				//if topic id found
				if(self.topicResults[i].ID === parseInt(id)) {
					//save current state of showNote property
					var state = self.topicResults[i].showNote;
					//fetch note data
					queryNote(id);
					//toggle show for note data
					self.topicResults[i].showNote = !state;
				}
			}
		}
		
		//note click event
		self.noteClick = function (id) {
			//hide clicked note
			for (var i = 0; i < self.topicResults.length; i++){
				if(self.topicResults[i].ID === parseInt(id)) {
					self.topicResults[i].showNote = false;
				}
			}
		}
		
		//search field keypress event
		self.searchKeyup = function () {
			//update search url
			updateUrl(0);
			//set all topic show bools to false
			allTopicsFalse();
		}
		
		//sets the Topic row class for highlighting
		self.setTopicClass = function (bool) {
			if(bool) {
				return 'active';
			}
		}

		//sets the Topic row html id
		self.setTopicID = function (id) {
			return 'topic-' + parseInt(id);
		}

		//sets the Description Title row html id
		self.setDescTitleID = function (id) {
			return 'descTitle-' + parseInt(id);
		}

		//sets the Description data row html id
		self.setDescDataID = function (id) {
			return 'descData-' + parseInt(id);
		}

		//sets the Note Title row html id
		self.setNoteTitleID = function (id) {
			return 'noteTitle-' + parseInt(id);
		}

		//sets the Note Data row html id
		self.setNoteDataID = function (id) {
			return 'noteData-' + parseInt(id);
		}
		
		//test function: before scroll
		self.beforeScroll = function () {
			$log.debug('fired before scroll');
		}
		//test function: after scroll
		self.afterScroll = function () {
			$log.debug('fired after scroll');
		}

}]);