app.controller("MainController", ['$scope', 'studyList', function($scope, studyList){
	$scope.myStacks = [
		{name: "My Stack"},
		{name: "Jiyongs Stack"},
		{name: "Chezas Stack"}
	];

	$scope.studyList = studyList.getStacks();
	$scope.studyListSer = studyList;

	console.log('studyList is' + $scope.isStudyList);

	$scope.addStack = function(stack){
		studyList.addStack(stack);
	}

	$scope.removeStack = function(stack){
		studyList.removeStack(stack);
	}
}]);

app.controller("FlipnavController", function($scope){

	$scope.front = true;

	$scope.toggleMe = function($event){
		//$scope.front == true ? $scope.front = false : $scope.front = true;
	};
});

app.controller("GridController", ['$scope', 'testFactory', function($scope, testFactory){
	$scope.testObjs = testFactory.getTestCards();
	console.log($scope.testObjs);

	$scope.rowCt = 3;
	$scope.colCt = 3;

	$scope.getNumber = function(num) {
		var newArr = new Array(num);
		for(var i=0; i<num; i++){
			newArr[i] = i + 1;
		}

	    return newArr;   
	}
}]);

app.controller("SearchController", ['$scope', 'testSearchFactory', function($scope, testSearchFactory){
	$scope.results = testSearchFactory.getResults();

	$scope.colCt = 3;
	$scope.rowCt = Math.ceil($scope.results.length / 3);

	$scope.preview = false;

	$scope.getCards = function(card){
		$scope.previewCards = testSearchFactory.getCards(card);
		console.log('preview cards are ' + $scope.previewCards);
		if(!$scope.preview)
			$scope.preview = true;

		for(var i=0; i<$scope.results.length; i++){
			if($scope.results[i].active != null && $scope.results[i].active == true){
				$scope.results[i].active = false;
				break;
			}
		}

		card.active = true;
	}

	$scope.getNumber = function(num) {
		var newArr = new Array(num);
		for(var i=0; i<num; i++){
			newArr[i] = i + 1;
		}

	    return newArr;   
	}
}]);