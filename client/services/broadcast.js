angular.module('whiteboard.services.broadcast', [])
.factory('Broadcast', function (Sockets) {

  var socketUserId;

  var getSocketId = function () {
    return socketUserId;
  };

  var saveSocketId = function (id) {
    socketUserId = id;
  };

  Sockets.emit('idRequest');

  var newShape = function (id, socketId, tool, mouseX, mouseY) {
    Sockets.emit('newShape', {
      shapeId: id,
      socketId: socketId,
      tool: tool,
      initX: mouseX,
      initY: mouseY
    });
  };

  var editShape = function (id, socketId, currentTool, mouseX, mouseY) {
    var data = {};
    data.mouseX = mouseX;
    data.mouseY = mouseY;
    data.shapeId = id;
    data.socketId = socketId;
    data.tool = currentTool;
    Sockets.emit('editShape', data);
  };

  var finishPath = function (shapeId, currentTool, pathDProps) {
    Sockets.emit('pathCompleted', {
      shapeId: shapeId,
      tool: currentTool,
      pathDProps: pathDProps
    })
  };

  var finishShape = function (shapeId, currentTool) {
    Sockets.emit('shapeCompleted', {
      shapeId: shapeId,
      tool: currentTool
    });
  };

  var deleteShape = function (shapeId, socketId) {
    Sockets.emit('deleteShape', {
      shapeId: shapeId,
      socketId: socketId
    })
  };

  var moveShape = function (shapeId, socketId, x, y) {
    Sockets.emit('moveShape', {
      shapeId: shapeId,
      socketId: socketId,
      initX: x,
      initY: y
    })
  };

  return {
    getSocketId: getSocketId,
    saveSocketId: saveSocketId,
    newShape: newShape,
    editShape: editShape,
    finishPath: finishPath,
    finishShape: finishShape,
    deleteShape: deleteShape,
    moveShape: moveShape
  };

});
