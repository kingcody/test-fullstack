'use strict';

var config = protractor.getInstance().params;
var UserModel = require(config.serverConfig.root + '/server/api/user/user.model');

describe('Logout View', function() {
  var login = function(user) {
    browser.get('/login');
    require('../login/login.po').login(user);
  };

  var testUser = {
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  };

  beforeEach(function() {
    return UserModel
      .removeAsync()
      .then(function() {
        return UserModel.createAsync(testUser);
      })
      .then(function() {
        return login(testUser);
      });
  });

  after(function() {
    return UserModel.removeAsync();
  })

  describe('with local auth', function() {

    it('should logout a user and redirecting to "/"', function() {
      var navbar = require('../../components/navbar/navbar.po');

      browser.getLocationAbsUrl().should.eventually.equal(config.baseUrl + '/');
      navbar.navbarAccountGreeting.getText().should.eventually.equal('Hello ' + testUser.name);

      browser.get('/logout');

      navbar = require('../../components/navbar/navbar.po');

      browser.getLocationAbsUrl().should.eventually.equal(config.baseUrl + '/');
      navbar.navbarAccountGreeting.isDisplayed().should.eventually.equal(false);
    });

  });
});
