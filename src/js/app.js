
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
		// $http.get('assets/data/data.json').success(function(data){
		// 	var parsedData = [];
		// 	for(x in data){
		// 	if(data[x].publish === true){
		// 		parsedData.push(data[x]);
		// 		}
		// 	}

		// 	)};
		var parsedData = [];
			client.entries({}, function(err, entries) {
			 if (err) { console.log(err); return; }
			  for(x in entries){
			  	parsedData.push(entries[x].fields);
			  	//console.log(entries[x].fields);
			  }
			  $scope.bricks = parsedData;
			  // console.log($scope.bricks.length+" bricks loaded");

			
			//console.log($routeParams);
			var brickId = $routeParams.id;
			$scope.brickLength = $scope.bricks.length;
			//check that the project is vald

			if(parseInt(brickId) >= $scope.bricks.length){
				console.log(brickId+" is not a project, re-direct to homepage");
				$location.path('/');
			}

			var cardSelected = $scope.bricks[brickId];
			 // console.log(cardSelected);

			$scope.$apply(function() {
				$scope.cardSelected = cardSelected;
				$scope.projectLoaded = true;

				if($scope.cardSelected.linkedIn != null){
					$scope.showingLinkedIn = true;
				 }
				else{
					$scope.showingLinkedIn = false;
				}

				if($scope.cardSelected.userPortfolio != null){
					$scope.showingPortfolio = true;
					$scope.showingLinkedIn = false;
				}
				else{
					$scope.showingPortfolio = false;
				}
				// //if they don't have a portfolio, but do have a linkedIn
			});

			//Check that the card was loaded otherwise redirect to the home page
			// if($scope.cardSelected === undefined){
			// 	console.log($routeParams.id+" is not a project, re-direct to homepage");
			// 	$location.path('/');
			// }


		});

		$scope.toTrusted = function(html){
			return $sce.trustAsHtml(html);
		}

		

		$scope.getNextId = function(){
			var thisId = parseInt($routeParams.id);
			var nextId = thisId+1;
			if(nextId >= $scope.brickLength){
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
	//get the content from the CMS
	var bricks = [];
		client.entries({
		}, function(err, entries) {
		 if (err) { console.log(err); return; }
		  for(x in entries){
		  	bricks.push(entries[x].fields);
		  	//console.log(entries[x].fields);
		  }
		  // console.log(bricks.length+" bricks loaded");
		
		$scope.$apply(function(){
			$scope.bricks = bricks;
			$scope.loadProjects();
			})
		});



		//request the data from the JSON file, load it into $scope.bricks
		// $http.get('assets/data/data.json').success(function(data){
		// 	// var parsedData = [];
		// 	for(x in data){
		// 	if(data[x].publish === true){
		// 		parsedData.push(data[x]);
		// 		}
		// 	}		
			
		// });
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
			console.log($scope.bricks.indexOf(value));
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
		var delay=800;
		setTimeout(function(){

		var $imgLoad = $('.brickContainer');
		$imgLoad.imagesLoaded(function(){
				document.getElementById("projectLoader").className = "hidden";
				document.getElementById("projects").className = "projectContainer show";
				$scope.shuffle();
				$scope.layout();
				// console.log("isotope has layed out");
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
	$scope.orderValue = null;
	$scope.setOrder = function(order){
		$scope.orderValue = order;
		$scope.layout();
	}

}));



