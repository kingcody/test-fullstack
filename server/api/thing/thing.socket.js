/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var events = require('events');
var thing = require('./thing.model');

module.exports = function(socketio) {
  thing.schema.post('save', function (doc) {
    socketio.to('thing').emit('thing:save', doc);
  });
  thing.schema.post('remove', function (doc) {
    socketio.to('thing').emit('thing:remove', doc);
  });
};
