
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

			//check that the project is vald
			if(parseInt(brickId) >= parsedData.length){
				console.log(brickId+" is not a project, re-direct to homepage");
				$location.path('/');
			}

			$scope.brickId = brickId;
			$scope.bricks = parsedData;
			$scope.brickLength = $scope.bricks.length;
			$scope.cardSelected = $scope.bricks[brickId];

			//Check that the card was loaded otherwise redirect to the home page
			if($scope.cardSelected === undefined){
				console.log($routeParams.id+" is not a project, re-direct to homepage");
				$location.path('/');
			}

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

		$scope.getNextId = function(){
			var thisId = parseInt($routeParams.id);
			var nextId = thisId+1;
			if(nextId === $scope.brickLength){
				nextId = 0;
			}
			return nextId;
		}

		$scope.getPrevId = function(){
			var thisId = parseInt($routeParams.id);
			var prevId = thisId -= 1;
			if(prevId < 0){
				prevId = ($scope.brickLength)-1;
			}
			return prevId;
		}
	}))


	.controller('id14Controller',  ng(function ($scope, $http, $sce, $location){
				//request the data from the JSON file, load it into $scope.bricks
		$http.get('assets/data/data.json').success(function(data){
			var parsedData = [];
			for(x in data){
			if(data[x].publish === true){
				parsedData.push(data[x]);
				}
			}		
			$scope.bricks = parsedData;
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
		var delay=300;
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



