// initialise angular
angular.module('id14App', ['templatescache', 'iso.directives', 'ngAnimate', 'ngRetina', 'ngRoute'])

	.config(ng(function config($routeProvider) {

		$routeProvider
			.when('/', {
				templateUrl: 'home.html',
				controller: 'id14Controller'
			})

			.when('/project/:id', {
				templateUrl: 'project.html',
				controller: 'projectController'
			})

			.otherwise({
				redirectTo: '/'
			});
	}))

	.controller('projectController', ng(function ($scope, $routeParams) {
		console.log('projectController');
		console.log($routeParams);
	}))


	.controller('id14Controller',  ng(function($scope, $http, $sce, $location){

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
		/*
		if (location.hash != ""){
	    	$scope.isPublic = true;
		}
		*/

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
		
		$scope.setCardSelected = function(value){
			$scope.cardSelected = value;
			location.hash = $scope.bricks.indexOf(value);
			
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
			// else{
			// 	$scope.showingPortfolio = false;
			// 	$scope.showingLinkedIn = false;
			// }
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
		$scope.toTrusted = function(html){
			return $sce.trustAsHtml(html);
		}
	
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
		var delay=1200;
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



