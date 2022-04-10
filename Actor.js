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

      this.tryToMove(surroundingCells, xDirection, yDirection);
   }

   tryToMove(surroundingCells, xDirection, yDirection) {
      var desiredPosition = this.position.copy();
      desiredPosition.add(xDirection * this.speed, yDirection * this.speed);

      for (let cell of surroundingCells) {
         for (let gridLine of cell.lines) {
            var closestPointOnLine = this.getVectorToClosestPointOnLine(gridLine, this.position);
            line(this.position.x, this.position.y, closestPointOnLine.x, closestPointOnLine.y);

            if ((desiredPosition.x - closestPointOnLine.x) ** 2 + (desiredPosition.y - closestPointOnLine.y) ** 2 <= (this.size / 2) ** 2)
            {
               // Can't move to the exact position, try to find another that moves in the wanted direction
               return;
            } else {

            }
         }
      }

      this.position = desiredPosition.copy();
   }

   getVectorToClosestPointOnLine(gridLine, position) {
      var lineVector = createVector(gridLine.end.x - gridLine.start.x, gridLine.end.y - gridLine.start.y);

      var lineNormalDotproduct = this.getDistanceToClosestPointOnLine(gridLine, position);
      var distance = abs(lineNormalDotproduct);
      var angle = PI / 2 + this.position.angleBetween(lineVector);
      var v1 = position.copy();
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

      return v1;
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