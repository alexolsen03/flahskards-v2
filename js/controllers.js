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

app.controller("FlipnavController", ['$rootScope', '$scope', '$state', '$modal', 'appManager', 'usersFactory', function($rootScope, $scope, $state, $modal, appManager, usersFactory){
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
	 			console.log('set user');
		 		$scope.myService.getUser().then(function(val){
		 			$scope.stacks = usersFactory.getUserStacks(val.id);
		 		});
	 		}
	 	}
	});

	$scope.setActiveStack = function(stack){
		console.log('setting active stack yo');
		$scope.myService.setStack(stack);
		$state.transitionTo('viewStack', null, {reload: true});
	}

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

	$scope.navigateToSearch = function(){
		$state.transitionTo('search', null, {reload: true});
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
}]);

app.controller("CreateController", ['$scope', '$state', 'appManager', 'stacksFactory', 'usersFactory', function($scope, $state, appManager, stacksFactory, usersFactory){
	$scope.cards = [];
	$scope.cardString = '';
	$scope.stackSize = 0;
	$scope.$watch('cardString', function(val){
		$scope.stackSize = $scope.cardString.split(/\r\n|\r|\n/).length;
	});

	$scope.createStack = function(){
		var cardSet = $scope.cardString.split(/\r\n|\r|\n/);
		console.log('card set is...');
		console.log(cardSet);
		$scope.cards = [];
		for(var i=0; i<cardSet.length; i++){
			var set = cardSet[i];
			var cardSides = set.split('=>');
			var card = {
				front_text: cardSides[0],
				back_text:  cardSides[1]
			}
			$scope.cards.push(card);
		}

		if($scope.cards != null){
			console.log('meeeh');
			console.log(appManager.getUser());
			appManager.getUser().then(function(data){
				console.log(data);
				var userId = data.id;
				console.log('user id is ' + userId);
				console.log($scope.cards);
				var stack = {
					title: $scope.stackTitle,
					subject_id: 1,
					rating: 2.5,
					difficulty: 1,
					public: true,
					cards_attributes: $scope.cards
				};
				data.stacks_attributes = [stack];
				data.password = 'testtest'
				var user = { user: data };
				usersFactory.updateUser(user).then(function(data){
					console.log('create user successful');
					console.log('data')
				});

			});
		}else{
			console.log('size is empty');
		}
		$state.transitionTo('viewStack');
	}
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

app.controller("SearchController", ['$scope', '$state', 'testSearchFactory', 'stacksFactory', 'cardsFactory', 'activeService', function($scope, $state, testSearchFactory, stacksFactory, cardsFactory, activeService){
	//$scope.results = testSearchFactory.getResults();
	stacksFactory.getStacks().then(function(data){
		$scope.results = data;
		console.log($scope.results);
		$scope.colCt = 3;
		$scope.rowCt = Math.ceil($scope.results.length / 3);
		console.log('rowCt is ' + $scope.rowCt);
	});

	$scope.preview = false;
	if($scope.$parent.front == false)
		$scope.$parent.front = true;

	$scope.getCards = function(card){
		cardsFactory.getCards(card.id).then(function(data){
			$scope.previewCards = data;
			if(!$scope.preview)
				$scope.preview = true;

			for(var i=0; i<$scope.results.length; i++){
				if($scope.results[i].active != null && $scope.results[i].active == true){
					$scope.results[i].active = false;
					break;
				}
			}

			$scope.rowCt = Math.ceil($scope.previewCards.length / 3);
			card.active = true;
		})
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
		activeService.emptyActiveStack();
		activeService.addToActiveStack($scope.previewCards);
		$scope.$parent.front == true ? $scope.$parent.front = false : $scope.$parent.front = true;
		$state.transitionTo('studyMode', null, {reload: true});
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
		shuffle($scope.optionCards);
	}

	function resetCards(){
		if($scope.optionCards != null){
			$scope.optionCards = null;
			$scope.activeCard = null;
		}
	}

	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex ;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
		}

		return array;
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

app.controller("ViewController", ['$scope', 'appManager', 'cardsFactory', 'usersFactory', function($scope, appManager, cardsFactory, usersFactory){
	$scope.stack = appManager.getStack();

	if($scope.stack != null){
		var stackId = appManager.getStack().id;

		if(stackId != null){
			cardsFactory.getCards(stackId).then(function(data){
				console.log('retreived cards...');
				console.log(data);
				$scope.cards = data;
				for(var i=0; i < $scope.cards.length; i++){
					$scope.cards[i].readonlyFront = true;
					$scope.cards[i].readonlyBack = true;
				}
			});
		}else{
			console.log('cant retreive cards... stack id is null');
		}
	}else{
		console.log('couldnt retreive cards');
	}

	$scope.toggleReadOnly = function(card, side){
		setReadonlyAs(true);

		if(side == "front")
			card.readonlyFront = !card.readonlyFront;
		else
			card.readonlyBack = !card.readonlyBack;
	}

	$scope.saveCard = function(card){
		if($scope.cards != null){
			if($scope.stack != null){
				$scope.stack.cards_attributes = $scope.cards;
				appManager.getUser().then(function(data){
					var userId = data.id;
					data.stacks_attributes = [$scope.stack];
					data.password = 'testtest'
					var user = { user: data };
					console.log(user);
					usersFactory.updateUser(user).then(function(data){
						console.log('update user successful');
						card.readonlyFront = true;
						card.readonlyBack = true;
					});

				});
			}
		}else{
			console.log('size is empty');
		}
		setReadonlyAs(true);
	}

	function setReadonlyAs(bool){
		for(var i=0; i < $scope.cards.length; i++){
			$scope.cards[i].readonlyFront = bool;
			$scope.cards[i].readonlyBack = bool;
		}
	}
}]);