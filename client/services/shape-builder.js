angular.module('whiteboard.services.shapebuilder', [])
.factory('ShapeBuilder', ['BoardData', function (BoardData) {

  function setColor (shape, colors) {
    if (shape.type === 'path') {
      shape.attr('stroke', colors.stroke);
    } else {
      shape.attr('stroke', colors.stroke);
      shape.attr('fill', colors.fill);
    }
  }

  function setWidth (shape, width) {
    shape.attr('stroke-width', width);
  }

  function drawExistingPath (shape) {
    newShape(shape.myid, shape.socketId, shape.tool, shape.initX, shape.initY);
    var existingPath = BoardData.getShapeById(shape.myid, shape.socketId);
    existingPath.customSetPathD(shape.pathDProps);
    existingPath.pathDProps = shape.pathDProps;
    BoardData.pushToStorage(shape.myid, shape.socketId, existingPath);
  }

  function newShape (id, socketId, tool, x, y) {
    var shapeConstructors = {
      'circle': function (x, y) {
        return BoardData.getBoard().circle(x, y, 0);
      },
      'line': function (x, y) {
        return BoardData.getBoard().path("M" + String(x) + "," + String(y));
      },
      'path': function (x, y) {
        var path = BoardData.getBoard().path("M" + String(x) + "," + String(y));
        // Do we wanna change this?
        path.pathDProps = '';
        return path;
      },
      'rectangle': function (x,y) {
        return BoardData.getBoard().rect(x, y, 0, 0);
      },
      'text': function (x, y, text) {
        return !!text ? BoardData.getBoard().text(x, y, text) : BoardData.getBoard().text(x, y, 'Insert Text');
      },
      'arrow': function (x, y) {
        var arrow = BoardData.getBoard().path("M" + String(x) + ',' + String(y));
        arrow.attr('arrow-end', 'classic-wide-long');
        return arrow;
      }
    };
    var shape = !!tool.text ? shapeConstructors[tool.name](x, y, tool.text) : shapeConstructors[tool.name](x, y);
    shape.initX = x;
    shape.initY = y;
    setColor(shape, tool.colors);
    shape.myid = id;
    shape.socketId = socketId;
    setWidth(shape, tool['stroke-width']);
    BoardData.pushToStorage(id, socketId, shape);
  };

  return {
    newShape: newShape,
    drawExistingPath: drawExistingPath
  };
  
}]);
