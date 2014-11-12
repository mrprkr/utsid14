// initialise angular
angular.module('id14App', ['templatescache', 'iso.directives', 'ngAnimate', 'ngRetina', 'ngRoute'])

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

		//======= SET CONFIG HERE =========

	
		//if the URL contains a direct link the site will load the preview view.

		$scope.isPublic = true;

		if (location.hash === "preview"){
	    	$scope.isPublic = true;
		}


		//======= HELPER FUNCTIONS HERE =============

		//isotope layout and shuffle
		$scope.layout = function(){
			$scope.$emit('iso-method', {name:null, params:null});
		};
		$scope.shuffle = function(){
			$scope.$emit('iso-method', {name:'shuffle', params:null});
		};

		//check if the card has a portfolio or linkedIn provided
		$scope.showingPortfolio = false;
		$scope.showingLinkedIn = false;

		//push the card selected to thelightbox
		$scope.cardSelected = null;
		
		

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

		//Converts plain text to HTML

	
		//pass in an ID to load that project up
		$scope.loadProject= function(value){
			cardLoaded = $scope.bricks[value];
			$scope.setCardSelected(cardLoaded);
			$scope.showProject();
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

		$scope.isPublished = function(card){
			return card.publish;
		}

	//======== LAYOUT FUNCTIONS =========
	//sets up the projects when images are loaded
	$scope.loadProjects = function(){
		var delay=1000;
		setTimeout(function(){

		var $imgLoad = $('.brickContainer');
		$imgLoad.imagesLoaded(function(){
				document.getElementById("projectLoader").className = "hidden";
				document.getElementById("projects").className = "projectContainer show";
				$scope.shuffle();
				//$scope.checkURL();
			});
		},delay);
	};

	/*$scope.checkURL = function(){
		//detect a hash link and set the integer into a variable.
		if(location.hash != "" && location.hash !="#/preview"){
			urlHash = location.hash;
			urlHash = urlHash.replace('#/', '');
			$scope.loadProject(urlHash);
		}
	}*/

	//Reaize function, re-layout if the window is re-sized.
	var globalResizeTimer = null;
	$(window).resize(function() {
    	if(globalResizeTimer != null) window.clearTimeout(globalResizeTimer);
	    globalResizeTimer = window.setTimeout(function() {
	        $scope.layout();
	    }, 200);
		})


	//Display the nav bar when scrolling
	// var projectsBottom = $('#sort-options').offset().top + $('#sort-options').height();
	// $(window).on('scroll',function(){
 //    // we round here to reduce a little workload
 //    stop = Math.round($(window).scrollTop());
 //    if (stop > projectsBottom) {
 //        $('nav').removeClass('hiddenNav');
 //    } else {
 //        $('nav').addClass('hiddenNav');
 //    }
	// });

	//runs the project setup once the code has loaded
	$scope.loadProjects();
}));



