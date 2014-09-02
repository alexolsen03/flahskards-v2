app.controller("MainController", ['$scope', 'studyList', function($scope, studyList){
	// $scope.myStacks = [
	// 	{name: "My Stack"},
	// 	{name: "Jiyongs Stack"},
	// 	{name: "Chezas Stack"}
	// ];

	// $scope.studyList = studyList.getStacks();
	// $scope.studyListSer = studyList;

	$scope.front = true;

	$scope.toggleNav = function($event){
		$scope.front == true ? $scope.front = false : $scope.front = true;
	};

	$scope.addStack = function(stack){
		studyList.addStack(stack);
	}

	$scope.removeStack = function(stack){
		studyList.removeStack(stack);
	}
}]);

app.controller("FlipnavController", function($scope){

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

app.controller("SearchController", ['$scope', 'testSearchFactory', 'activeService', function($scope, testSearchFactory, activeService){
	$scope.results = testSearchFactory.getResults();

	$scope.colCt = 3;
	$scope.rowCt = Math.ceil($scope.results.length / 3);

	$scope.preview = false;
	if($scope.$parent.front == false)
		$scope.$parent.front = true;

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

	$scope.toggleView = function(){
		console.log('toggling view');
		activeService.addToActiveStack($scope.previewCards);
		$scope.$parent.front == true ? $scope.$parent.front = false : $scope.$parent.front = true;
	}
}]);

app.controller("StudyController", ['$scope', 'activeService', function($scope, activeService){
	$scope.amtCorrect = 0;
	$scope.amtAsked = 0;
	$scope.nOptions = 3;

	prepareStudyCards();

	function prepareStudyCards(){
		resetCards();
		$scope.activeCard = activeService.getNCards(1)[0];
		console.log('retrevied active card');
		console.log($scope.activeCard);
		$scope.optionCards = activeService.getNCards(($scope.nOptions - 1), $scope.activeCard);
		$scope.optionCards.push($scope.activeCard);
	}

	function resetCards(){
		if($scope.optionCards != null){
			$scope.optionCards = null;
			$scope.activeCard = null;
		}
	}

	$scope.submitAnswer = function(card){
		console.log('meh');
		$scope.amtAsked++;
		if(card == $scope.activeCard){
			$scope.amtCorrect++;
		}
		prepareStudyCards();
	}
}]);