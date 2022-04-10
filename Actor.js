class Actor {
   constructor(x, y, size) {
      this.size = size;
      this.speed = 2;
      this.position = createVector(x, y);
   }

   draw() {
      stroke(0);
      fill(255, 0, 0);
      circle(this.position.x, this.position.y, this.size);
   }

   move(surroundingCells) {
      var xDirection = 0;
      var yDirection = 0;

      if (keyIsDown(LEFT_ARROW)) {
         xDirection = -1;
      }

      if (keyIsDown(RIGHT_ARROW)) {
         xDirection = 1;
      }

      if (keyIsDown(UP_ARROW)) {
         yDirection = -1;
      }

      if (keyIsDown(DOWN_ARROW)) {
         yDirection = 1;
      }

      var cells = this.getVectorToClosestLine(surroundingCells);

      var canMove = true;
      for (let c of cells) {
         stroke(0);
         line(this.position.x, this.position.y, c.vectorToClosestPoint.x, c.vectorToClosestPoint.y);
      }

      if (canMove) {
         this.position.add(xDirection * this.speed, yDirection * this.speed);
      }
   }

   getVectorToClosestLine(surroundingCells) {
      var cells = [];

      for (let cell of surroundingCells) {
         for (let gridLine of cell.lines) {
            var lineNormalDotproduct = this.getDistanceToClosestPointOnLine(gridLine, this.position);
            var distance = abs(lineNormalDotproduct);

            var lineVector = createVector(gridLine.end.x - gridLine.start.x, gridLine.end.y - gridLine.start.y);
            var angle = PI / 2 + this.position.angleBetween(lineVector);
            var v1 = this.position.copy();
            v1.setMag(distance);

            if (lineNormalDotproduct < 0) {
               v1.rotate(angle);
            } else if (lineNormalDotproduct > 0) {
               v1.rotate(PI + angle);
            }

            v1.add(this.position);
            var lineSize = gridLine.start.dist(gridLine.end);
            var d1 = v1.dist(gridLine.start);
            var d2 = v1.dist(gridLine.end);
            if (d1 >= lineSize || d2 >= lineSize) {
               if (d1 > d2) {
                  v1 = createVector(gridLine.end.x, gridLine.end.y);
               } else {
                  v1 = createVector(gridLine.start.x, gridLine.start.y);
               }
            }

            cells.push({cell: cell, vectorToClosestPoint: v1});
         }
      }

      return cells;
   }

   getDistanceToClosestPointOnLine(gridLine, point) {
      var x0 = point.x;
      var y0 = point.y;
      var x1 = gridLine.end.x;
      var y1 = gridLine.end.y;
      var x2 = gridLine.start.x;
      var y2 = gridLine.start.y;

      // https://math.stackexchange.com/questions/274712/calculate-on-which-side-of-a-straight-line-is-a-given-point-located
      return ((x0 - x1) * (y2 - y1) - (y0 - y1) * (x2 - x1)) / sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
   }
}