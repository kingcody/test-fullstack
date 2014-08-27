'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var chaiAsPromised = require('chai-as-promised');

var expect = chai.expect;
chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);