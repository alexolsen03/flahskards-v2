app.controller("MainController", ['$scope', 'studyList', function($scope, $modal, studyList){
	$scope.front = true;

	$scope.toggleNav = function($event){
		$scope.front == !$scope.front;
	};

	$scope.addStack = function(stack){
		studyList.addStack(stack);
	}

	$scope.removeStack = function(stack){
		studyList.removeStack(stack);
	}
}]);

app.controller("FlipnavController", ['$rootScope', '$scope', '$modal', 'appManager', 'usersFactory', function($rootScope, $scope, $modal, appManager, usersFactory){
	$scope.myService = appManager;
	$scope.logout = false;
	$scope.status = {
	    isopen: false
	};

	$scope.stacks = [{title: 'none'}];

	$scope.$watch('myService.getUser()', function(newVal){
	 	console.log('watch is firing');

	 	if($scope.myService.getUser() != null){
	 		$scope.userLoggedIn = appManager.isUserLoggedIn();
	 	}
	 	
	 	//session is active but appManager needs a user object
	 	if(!$scope.userLoggedIn){
	 		if($scope.myService.isUserLoggedIn() && $scope.logout){
	 			$scope.myService.setUser($scope.myService.getUserInSession());
	 			console.log('meeeh');
		 		$scope.myService.getUser().then(function(val){
		 			$scope.stacks = usersFactory.getUserStacks(val.id);
		 		});
		 	// 	if($scope.myService.getUser() != null)
				// 	$scope.stacks = usersFactory.getUserStacks($scope.myService.getUser().id);
				// else
				// 	$scope.stacks = [{title: 'none'}];
	 		}
	 	}
	});

	$scope.openModal = function(size){
		var modalInstance = $modal.open({
			templateUrl: '/js/directive_templates/loginmodal.html',
			controller: 'LoginController',
			size: size
		});
	}

	$scope.logout = function(){
		appManager.logoutUser();
		$scope.logout = false;
		$scope.userLoggedIn = false;
	}
}]);

app.controller("LoginController", ['$rootScope', '$scope', '$modalInstance', 'appManager', 'usersFactory', function($rootScope, $scope, $modalInstance, appManager, usersFactory){
	//be sure to validate this on the server
	$scope.passwordLength = 8;

	$scope.signUp = function(user){
		createUser(user);
	}

	$scope.signIn = function(email, password){
		getUser('email', password);
	}

	function createUser(){
		var usr = {
			username: 'test_user',
			email: 'test@gmail.com',
			account_type_id: 3,
			password: 'testtest',
			password_confirmation: 'testtest',
		};
		usersFactory.createUser(usr);
	}

	function getUser(email, pass){
		usersFactory.getUser(1).then(function(data){
			if(data != null && data.email != null){ //see if it returned the object i expect
				data.password = pass;
				appManager.createSession(data).then(function(d){
					console.log('returned promise and data');
					console.log(data);
					appManager.setUser(data);
				});
				//$rootScope.$emit('rootScope:emit', 'emit!');
				$modalInstance.close();
			}else{
				console.log('returned strange object');
			}
		});
	}

	// $scope.ok = function () {
	// 	//
	//     $modalInstance.close($scope.selected.item);
	// };

	// $scope.cancel = function () {
	// 	//
	//     $modalInstance.dismiss('cancel');
	// };
}]);

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