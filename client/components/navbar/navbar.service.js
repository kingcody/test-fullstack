'use strict';

angular.module('testFullstackApp')
  .factory('Navbar', function () {
    // Navbar model
    return {
      isCollapsed: true,
      menu: [{
        'title': 'Home',
        'state': 'main'
      }]
    };
  });
