var socketio = require('socket.io');
var rooms = require('./rooms');
var client = require('./db/config');
var _ = require('underscore');

module.exports = function(server) {

  var room = {};
  var board = {};

  var io = socketio.listen(server);

  io.on('connection', function (socket) {

    socket.on('idRequest', function () {
      socket.emit('socketId', {socketId: socket.id});
    });

    socket.on('roomId', function (data) {
      rooms.addMember(socket, data.roomId);
    });

    socket.on('newShape', function (data) {
      socket.to(this.room).emit('shapeCreated', data);
      rooms.addShape(data, socket);
    });

    socket.on('editShape', function (data) {
      socket.to(this.room).emit('shapeEdited', data);
      rooms.editShape(data, socket);
    });

    socket.on('shapeCompleted', function (data) {
      socket.to(this.room).emit('shapeCompleted', {
        socketId: socket.id,
        shapeId: data.shapeId,
        tool: data.tool
      });
      rooms.completeShape(data, socket);
    });

    socket.on('pathCompleted', function (data) {
      rooms.completePath(data, socket);
    });

    socket.on('moveShape', function (data) {
      rooms.moveShape(data, socket);
      // rooms.completeShape(socket);
      socket.to(this.room).emit('shapeMoved', data);
    });

    socket.on('deleteShape', function (data) {
      rooms.deleteShape(data, socket);
      socket.to(this.room).emit('shapeDeleted', {shapeId: data.shapeId, socketId: data.socketId});
    });

    socket.on('disconnect', function () {
      rooms.handleMemberDisconnect(socket);
    });

  });

  return io;

};
