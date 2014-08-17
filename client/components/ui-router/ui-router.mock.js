var states = [],
    currentState = {
      self: {
        name: null,
        url: null
      }
    };

angular.module('stateMock', []);
angular.module('stateMock').service("$state", function($q, $rootScope) {

  this.$current = currentState;

  this.expectedTransitions = [];
  this.transitionTo = function(stateName) {
    if (this.expectedTransitions.length > 0) {
      var expectedState = this.expectedTransitions.shift();
      if (expectedState !== stateName) {
        throw Error("Expected transition to state: " + expectedState + " but transitioned to " + stateName);
      }
    } else {
      throw Error("No more transitions were expected! Tried to transition to " + stateName);
    }
    this.$current.self.name = stateName;
    this.$current.self.url = this.href(stateName);
    $rootScope.$broadcast('$stateChangeSuccess');
    console.log("Mock transition to: " + stateName);
    var deferred = $q.defer();
    var promise = deferred.promise;
    deferred.resolve();
    return promise;
  }
  this.go = this.transitionTo;

  this.href = function(stateName, params, options) {
    return '/' + stateName;
  }

  this.get = function(stateName) {
    var self = this;
    return {
      name: stateName,
      url: self.href(stateName)
    };
  }

  this.expectTransitionTo = function(stateName) {
    this.expectedTransitions.push(stateName);
  }


  this.ensureAllTransitionsHappened = function() {
    if (this.expectedTransitions.length > 0) {
      throw Error("Not all transitions happened!");
    }
  }
});
