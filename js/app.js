var app = angular.module("Flashkards", ['ui.router', 'ui.bootstrap']);

app.config(function($stateProvider, $urlRouterProvider){
	$urlRouterProvider.otherwise('/home');

	$stateProvider

		.state('home', {
			url: '/home',
			templateUrl: '/partials/splash.html'
		});

	$stateProvider

		.state('search', {
			url: '/search',
			templateUrl: '/partials/search.html',
			controller: 'SearchController'
		});

	$stateProvider

		.state('studyMode', {
			url: '/study',
			templateUrl: '/partials/study.html',
			controller: 'StudyController'
		});

	$stateProvider

		.state('create', {
			url: '/create',
			templateUrl: 'partials/create.html',
			controller: 'CreateController'
		});





});