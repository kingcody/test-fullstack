'use strict';

angular.module('testFullstackApp')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {
      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },
      changeEmail: {
        method: 'PUT',
        params: {
          controller: 'email'
        }
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      confirm: {
        method: 'POST',
        params: {
          controller: 'confirm'
        }
      }
	  });
  });
