app.directive("flipnav", function(){
	return{
		restrict: 'E',
		templateUrl: '/js/directive_templates/flipnav.html',
		scope: {
			title: '@'
		},
		controller: 'FlipnavController'
	}
});

app.directive("leftside", function(){
	return{
		restrict: 'E',
		templateUrl: '/js/directive_templates/leftside.html',
		scope:{},
		controller: 'MainController'
	}
});

app.directive("grid", function(){
	return{
		restrict: 'E',
		templateUrl: '/js/directive_templates/grid.html',
		scope:{},
		controller: 'GridController'
	}
});