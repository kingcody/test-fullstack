'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('testFullstack3App'));
  beforeEach(module('stateMock'));
  beforeEach(module('socketMock'));

  var MainCtrl,
      scope,
      state,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, $state) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/things')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    state = $state;
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of things to the scope', function () {
    $httpBackend.flush();
    scope.awesomeThings.length.should.equal(4);
  });
});
