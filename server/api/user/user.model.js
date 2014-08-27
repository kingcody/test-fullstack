'use strict';

var mongoose  = require('mongoose');
var Schema    = mongoose.Schema;
var crypto    = require('crypto');


var CredentialSchema = new Schema({
  type: {
    type: String,
    "default": 'email',
    "enum": ['email', 'phone']
  },
  value: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  confirmed: {
    type: Boolean,
    "default": false
  }
}, { _id:false });



var UserSchema = new Schema({
  name: String,
  role: {
    type: String,
    "default": 'user'
  },
  username: String,
  salt: String,
  hashedPassword: String,

  credentials: [ CredentialSchema ]
});

UserSchema
.virtual('password')
.set(function(pwd) {
  this.salt = this.makeSalt();
  this.hashedPassword = this.encryptPassword(pwd);


});

UserSchema
.path('hashedPassword')
.validate(function(hashedPwd) {

  return !!hashedPwd.length;
}, 'Password cannot be blank');

UserSchema
.virtual('email')
.set(function(email) {
  this.credentials.push({
    value: email
  });

}).get(function() {
  // returns only first found email
  // TODO: in case of multiple emails, should prioritize confirmed ones
  return this.credentials.filter(function(c) {
    return c.type==='email';

  })[0].value;
});

UserSchema
.virtual('emails')
.get(function() {
  return this.credentials
    .filter(function(c) { return c.type==='email'; })
    .map(function(c) { return c.value; });

});

UserSchema
.pre('save', function(next) {

  mongoose.models.User
    .where('credentials.type').equals('email')
    .where('credentials.value').equals(this.email)
    .where('_id').ne(String(this._id))
    .exec(function(err, users) {
      if (users.length) {
        return next(new Error('Account with this email address already exists'));
      }
      next();
    });

});

UserSchema.methods = {
  authenticate: function(pwd) {
    return this.hashedPassword === this.encryptPassword(pwd);
  },
  encryptPassword: function(pwd) {
    var salt;
    if (!pwd || !this.salt) {
      return null;
    }
    salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(pwd, salt, 10000, 64).toString('base64');
  },
  confirm: function(emailOrPhone, cb) {
    this.credentials.forEach(function(c) {
      if (c.value===emailOrPhone) {
        c.confirmed = true;
      }
    });
    this.save(cb);
  },
  changeEmail: function(oldEmail, newEmail, cb) {
    this.credentials.forEach(function(c) {
      if (c.value===oldEmail) {
        c.value = newEmail;
        c.confirmed = false;
      }
    });
    this.save(cb);
  },
  makeSalt: function() {
    return crypto.randomBytes(16).toString('base64');
  }
};

UserSchema.statics = {
  findOneByEmail: function(email, cb) {
    this.find({ 'credentials.value': email.toLowerCase() })
    .where('credentials.type').equals('email')
    .exec(function(err, user) {
      if (err) return cb(err);
      if (user.length === 0) return cb(null, null);

      cb(null, user[0]);
    });
  }
};

module.exports = mongoose.model('User', UserSchema);
