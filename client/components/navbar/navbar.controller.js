'use strict';

angular.module('testFullstackApp')
  .controller('NavbarCtrl', function ($scope, Navbar, Auth) {
    $scope.Auth = Auth;

    return Navbar;
  });
