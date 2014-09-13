'use strict';

/* Services */

app.service('appManager', function($window, $http) {
  this.stackHolder = {};
  this.userHolder = {};

  this.setStack =  function(newObj) {
      this.stackHolder['stack'] = newObj;
  };
  this.getStack = function(){
      return this.stackHolder['stack'];
  };
  this.setUser = function(newObj) {
      this.userHolder['user'] = newObj;
  };
  this.getUser = function(){
      return this.userHolder['user'];
  };
  this.createSession = function (user){
      console.log('creating session');
      return $http.post('http://localhost:3000/api/v1/signin?email=' + user.email + '&password=' + user.password).then(function(result){
        console.log(result.data);
        console.log('token: ' + result.data.token.access_token);
        console.log('email: ' + result.data.user.email);
        $window.sessionStorage.token = result.data.token.access_token;
        $window.sessionStorage.email = result.data.user.email;
        return result.data;
      });
    };
  this.isUserLoggedIn = function(){
    if($window.sessionStorage.token == null)
      return false;
    else
      return true;
  };
  this.getUserInSession = function(){
    return $http.get('http://localhost:3000/api/v1/sessions/' + $window.sessionStorage.token).then(function(result){
        return result.data.user;
    });
  };
  this.logoutUser = function(){
    $http
        .delete('http://localhost:3000/api/v1/signout', this.userHolder['user'])
          .success(function (data, status, headers, config) {
            delete $window.sessionStorage.token;
            delete $window.sessionStorage.email;
        });
    this.setUser(null);
  }
});

app.service('studyList', function(){
  var stacks = [];

  this.addStack = function(stack){
    console.log('adding stack');
    if(stacks.indexOf(stack) == -1)
      stacks.push(stack);
  };

  this.getStacks = function(){
    console.log('getting stacks');
    return stacks;
  };

  this.removeStack = function(stack){
    var index = stacks.indexOf(stack);
    if(index > -1)
      stacks.splice(index, 1);
  }

  this.hasStacks = function(){
    if(stacks.length > 0)
      return true;
    else
      return false;
  };
});

/* Factories */

app.factory('stacksFactory', function($http) {
  return {
    getStacks: function(){
    	return $http.get('http://localhost:3000/api/v1/stacks').then(function(result){
    		return result.data;
    	});
    },
    createStack: function(userId, stackInfo){
      var stack = {stack: stackInfo};
      return $http.post('http://localhost:3000/api/v1/users/' + userId + '/stacks', stack).then(function(result){
        return result.data;
      });
    }
  };
});

app.factory('cardsFactory', function($http) {
  return {
    getCard: function(cardId){
      return $http.get('http://localhost:3000/api/v1/cards/' + cardId).then(function(result){
        return result.data;
      });
    },
    getCards: function(stackId){
      return $http.get('http://localhost:3000/api/v1/stacks/' + stackId + '/cards').then(function(result){
        return result.data;
      });
    },
    createCard: function(stackId, stackInfo){
      var stack = {stack: stackInfo};
      return $http.post('http://localhost:3000/api/v1/stacks/' + stackId + '/cards', stack).then(function(result){
        return result.data;
      });
    }
  };
});

app.factory('usersFactory', function($http, $window) {
  return {
    getUser: function(userId){
      return $http.get('http://localhost:3000/api/v1/users/' + userId).then(function(result){
        return result.data;
      });
    },
    getUsers: function(){
    	return $http.get('http://localhost:3000/api/v1/users').then(function(result){
    		return result.data;
    	});
    },
    createUser: function(userInfo){
    	var user = {user: userInfo};
    	return $http.post('http://localhost:3000/api/v1/users', user).then(function(result){
    		return result.data;
    	});
    },
    getUserStacks: function(userId){
      return $http.get('http://localhost:3000/api/v1/users/' + userId + '/stacks').then(function(result){
        return result.data;
      });
    }
  };
});

app.factory('subjectsFactory', function($http){
  return{
    getSubjects: function(){
      return $http.get('http://localhost:3000/api/v1/subjects').then(function(result){
        return result.data;
      });
    }
  };
});

app.service('activeService', function(){
  var activeStack = [];

  this.addToActiveStack = function(stack){
    console.log('adding to active stack');
    console.log(stack)
    activeStack = activeStack.concat(stack);
    console.log('after active stack is..');
    console.log(activeStack);
  };

  this.getActiveStack = function(){
    return activeStack;
  };

  this.emptyActiveStack = function(){
    activeStack = [];
  };

  this.getNCards = function(n, ignoreCard){
    var returnCards = [];
    for(var i=0; i<n; i++){
      var option = null;
      while(option == null){
        var randIndex = Math.floor((Math.random() * (activeStack.length - 1)) + 1);
        console.log('randIndex is ' + randIndex);
        var prospect = activeStack[randIndex];
        if(ignoreCard != null){
          console.log('ignoreCard is not null');
          if(prospect != ignoreCard && returnCards.indexOf(prospect) < 0)
            option = prospect;
        }else{
          if(returnCards.indexOf(prospect) < 0)
            option = prospect;
        }
      }
      console.log('pushing ');
      console.log(option.front);
      returnCards.push(option);
    }

    return returnCards;
  };
});

app.factory('testSearchFactory', function(){
  return{
    getResults: function(){
      var objs = [
        {
          title: "Here is a Title",
          author: "alexo",
          count: 23,
          subject: "biology",
        },
        {
          title: "Oh hey another",
          author: "alexo",
          count: 23,
          subject: "korean",
        },
        {
          title: "Dooby dooby Doo",
          author: "alexo",
          count: 23,
          subject: "german",
        },
        {
          title: "Batteries, Pliers, Etc.",
          author: "alexo",
          count: 23,
          subject: "algebra",
        }
      ];
      return objs;
    },

    getCards: function(id){
      var cards = [
          {
            front: 'Saturday',
            back:  'Sonnerstag'
          },
          {
            front: 'Monday',
            back:  'Montag'
          },
          {
            front: 'Sunday',
            back:  'Sonntag'
          },
          {
            front: 'Tuesday',
            back:  'Deinstag'
          },
          {
            front: 'Wednesday',
            back:  'Mittag'
          },
          {
            front: 'Friday',
            back:  'Freitag'
          }
      ];
      return cards;
    }
  }
});

/* test factory for splash screen */
app.service('testFactory', [function () {
  //replace with webservice call
  var testers = [
        {
          title: "Here is a Title",
          author: "alexo",
          count: 23,
          subject: "biology",
        },
        {
          title: "Oh hey another",
          author: "alexo",
          count: 23,
          subject: "korean",
        },
        {
          title: "Dooby dooby Doo",
          author: "alexo",
          count: 23,
          subject: "german",
        },
        {
          title: "Batteries, Pliers, Etc.",
          author: "alexo",
          count: 23,
          subject: "algebra",
        },
        {
          title: "Should have made 2 trips",
          author: "alexo",
          count: 23,
          subject: "history",
        },
        {
          title: "A man in Denver",
          author: "alexo",
          count: 23,
          subject: "world history",
        },
        {
          title: "My shirt said my name",
          author: "alexo",
          count: 23,
          subject: "geography",
        },
        {
          title: "Alabama has good football",
          author: "alexo",
          count: 23,
          subject: "finance",
        },
        {
          title: "He was at the dentist",
          author: "alexo",
          count: 23,
          subject: "business",
        },
        {
          title: "Theres always a bottleneck",
          author: "alexo",
          count: 23,
          subject: "calculus",
        },
        {
          title: "Do or do not, there is no try",
          author: "alexo",
          count: 23,
          subject: "chemistry",
        },
        {
          title: "Happy Happy joy joy",
          author: "alexo",
          count: 23,
          subject: "biology",
        },
        {
          title: "Here is a Title",
          author: "alexo",
          count: 23,
          subject: "biology",
        },
        {
          title: "Oh hey another",
          author: "alexo",
          count: 23,
          subject: "korean",
        },
        {
          title: "Dooby dooby Doo",
          author: "alexo",
          count: 23,
          subject: "german",
        },
        {
          title: "Here is a Title",
          author: "alexo",
          count: 23,
          subject: "biology",
        },
        {
          title: "Oh hey another",
          author: "alexo",
          count: 23,
          subject: "korean",
        },
        {
          title: "Dooby dooby Doo",
          author: "alexo",
          count: 23,
          subject: "german",
        }
  ]

    this.getTestCards = function(){
      return testers;
    };

    this.getCardByIndex = function(index){
      return testers[index];
    }
}])


/* interceptors */

app.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {

      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.token  = $window.sessionStorage.token;
      }
      if ($window.sessionStorage.email) {
        config.headers.email = $window.sessionStorage.email;
      }

      return config;
    },
    response: function (response) {
      if (response.status === 401) {
        document.location.href = "/app/index.html";
      }
      return response || $q.when(response);
    }
  };
});

app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});