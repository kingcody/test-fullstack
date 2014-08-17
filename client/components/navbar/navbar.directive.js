'use strict';

angular.module('testFullstackApp')
  .directive('navbar', function () {
    return {
      controller: 'NavbarCtrl',
      controllerAs: 'Navbar',
      templateUrl: 'components/navbar/navbar.html',
      restrict: 'EA'
    };
  });
