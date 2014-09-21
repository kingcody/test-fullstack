'use strict';

var config = protractor.getInstance().params,
    UserModel = require(config.serverConfig.root + '/server/api/user/user.model');

describe('Signup View', function() {
  var page,
      loadPage = function() {
        browser.get('/signup');
        page = require('./signup.po');
      },
      testUser = {
        name: 'Test User',
        email: 'test@test.com',
        password: 'test'
      };

  beforeEach(function() {
    loadPage();
  });

  it('should include signup form with correct inputs and submit button', function() {
    expect(page.form.name.getAttribute('type')).toBe('text');
    expect(page.form.name.getAttribute('name')).toBe('name');
    expect(page.form.email.getAttribute('type')).toBe('email');
    expect(page.form.email.getAttribute('name')).toBe('email');
    expect(page.form.password.getAttribute('type')).toBe('password');
    expect(page.form.password.getAttribute('name')).toBe('password');
    expect(page.form.submit.getAttribute('type')).toBe('submit');
    expect(page.form.submit.getText()).toBe('Sign up');
  });

  describe('with local auth', function() {
    it('should signup a new user, log them in, and redirecting to "/"', function(done) {
      UserModel.remove(function() {
        page.signup(testUser, function() {
          var navbar = require('../../components/navbar/navbar.po');

          expect(browser.getLocationAbsUrl()).toBe(config.baseUrl + '/');
          expect(navbar.navbarAccountGreeting.getText()).toBe('Hello ' + testUser.name);

          done();
        });
      });
    });

    it('should indicate signup failures', function(done) {
      page.signup(testUser, function() {
        expect(page.form.email.getAttribute('class')).toContain('ng-invalid-mongoose');

        var helpBlock = page.form.element(by.css('.form-group.has-error .help-block.ng-binding'));
        expect(helpBlock.getText()).toBe('The specified email address is already in use.');

        done();
      });
    });
  });

});
