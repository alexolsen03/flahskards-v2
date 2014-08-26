var app = angular.module("Flashkards", ['ui.router']);

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
});