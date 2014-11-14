var client = contentful.createClient({
  // ID of Space
  space: 'egxvths7m3g5',

  // A valid access token within the Space
  accessToken: 'ab14c2d86fd66374237d5188d1291cbe0e33aeb96f417dc18efdfa19c90a00ce',

  // Enable or disable SSL. Enabled by default.
  secure: true,

  // Set an alternate hostname, default shown.
  host: 'cdn.contentful.com'
});

client.entries({}, function(err, entries) {
  if (err) { console.log(err); return; }
  console.log(entries);
});

// initialise angular
angular.module('id14App', ['templatescache', 'iso.directives', 'ngAnimate', 'ngRetina', 'ngRoute', 'ng-contentful'])

	.config(ng(function config($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'home.html',
				controller: 'id14Controller',
				reloadOnSearch: false
			})

			.when('/project/:id', {
				templateUrl: 'project.html',
				controller: 'projectController'
			})

			.otherwise({
				redirectTo: '/'
			});
	}))

	.controller('projectController', ng(function ($scope, $routeParams, $http, $sce, $location) {
		$http.get('assets/data/data.json').success(function(data){
			var parsedData = [];
			for(x in data){
			if(data[x].publish === true){
				parsedData.push(data[x]);
				}
			}
			//console.log($routeParams);
			var brickId = $routeParams.id;
			$scope.bricks = parsedData;
			$scope.cardSelected = $scope.bricks[brickId];

			if($scope.cardSelected.userPortfolio != null){
				$scope.showingPortfolio = true;
			}
			else{
				$scope.showingPortfolio = false;
			}
			// //if they don't have a portfolio, but do have a linkedIn
			if($scope.cardSelected.linkedIn != null){
				$scope.showingLinkedIn = true;
			 }
			else{
				$scope.showingLinkedIn = false;
			}
		});

		$scope.toTrusted = function(html){
			return $sce.trustAsHtml(html);
		}

		$scope.getNextId = function(value){
			var nextId = $scope.bricks.indexOf(value);
			nextId += 1;
			if(nextId === $scope.bricks.length){
				nextId = 0;
			}
			return nextId;
		}

		$scope.getPrevId = function(value){
			var nextId = $scope.bricks.indexOf(value);
			nextId -= 1;
			if(nextId < 0){
				nextId = ($scope.bricks.length)-1;
			}
			return nextId;
		}

		$scope.nextProjectId = function(){
			var currentId = $scope.bricks.indexOf($scope.cardSelected);
			if(currentId < $scope.bricks.length){
				return currentId+=1;
			}
			else {
				return 0;
			}
		}
	}))


	.controller('id14Controller',  ng(function ($scope, $http, $sce, $location){
		if(localStorage.projectData != undefined){

		}
		//request the data from the JSON file, load it into $scope.bricks
		$http.get('assets/data/data.json').success(function(data){
			var parsedData = [];
			for(x in data){
			if(data[x].publish === true){
				parsedData.push(data[x]);
				}
			}		
			$scope.bricks = parsedData;
			var projectData = JSON.stringify(parsedData);
			localStorage.setItem('projectData', projectData);	
		});

		//======= HELPER FUNCTIONS HERE =============

		//isotope layout and shuffle
		$scope.layout = function(){
			$scope.$emit('iso-method', {name:null, params:null});
		};
		$scope.shuffle = function(){
			$scope.$emit('iso-method', {name:'shuffle', params:null});
		};

		$scope.getId = function(value){
			return $scope.bricks.indexOf(value);
		}

		//Event information tray state
		$scope.showingInfo = false;
		$scope.showInfo = function(){
			$scope.showingInfo = !$scope.showingInfo;
		}

		//Lightbox State
		$scope.showingproject = true;
		$scope.showProject = function(){
			$scope.showingProject = !$scope.showingProject;
			if($scope.showingProject === true){
				$('nav').removeClass('hiddenNav');
				$('body').addClass('noScroll');
			}
			else{
				$('body').removeClass('noScroll');
			}
		}

		$scope.setProjectName = function(value){
			var lastCharacter = value.substr(value.length - 1);
			if(lastCharacter === 's'){
				return("Open "+value+"' project");
			}
			else{
				return("Open "+value+"'s project");
			}
		}

	//======== LAYOUT FUNCTIONS =========
	//sets up the projects when images are loaded
	$scope.loadProjects = function(){
		var delay=200;
		setTimeout(function(){

		var $imgLoad = $('.brickContainer');
		$imgLoad.imagesLoaded(function(){
				document.getElementById("projectLoader").className = "hidden";
				document.getElementById("projects").className = "projectContainer show";
				$scope.shuffle();
			});
		},delay);
	};

	//Reaize function, re-layout if the window is re-sized.
	var globalResizeTimer = null;
	$(window).resize(function() {
    	if(globalResizeTimer != null) window.clearTimeout(globalResizeTimer);
	    globalResizeTimer = window.setTimeout(function() {
	        $scope.layout();
	    }, 200);
		})


	//runs the project setup once the code has loaded
	$scope.loadProjects();
}));



