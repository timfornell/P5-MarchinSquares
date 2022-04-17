class Actor {
   constructor(x, y, size) {
      this.size = size;
      this.speed = 2;
      this.position = createVector(x, y);
   }

   draw() {
      stroke(0);
      fill(255, 0, 0, 120);
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

   pointIsInsideActor(desiredPosition, positionOnLine) {
      return (desiredPosition.x - positionOnLine.x) ** 2 + (desiredPosition.y - positionOnLine.y) ** 2 <= (this.size / 2) ** 2
   }

   tryToMove(surroundingCells, xDirection, yDirection) {
      var desiredPosition = this.position.copy();
      desiredPosition.add(xDirection * this.speed, yDirection * this.speed);
      var collisions = [];

      for (let cell of surroundingCells) {
         for (let gridLine of cell.lines) {
            var closestPointOnLine = this.getVectorToClosestPointOnLine(gridLine, this.position);
            line(this.position.x, this.position.y, closestPointOnLine.x, closestPointOnLine.y);

            // This works as long as the object isn't moving 'too' fast
            if (this.pointIsInsideActor(desiredPosition, closestPointOnLine))
            {
               // Can't move to the exact position, try to find another that moves in the wanted direction
               collisions.push({gridLine: gridLine, closestPoint: closestPointOnLine});
            }
         }
      }

      if (collisions.length == 0) {
         this.position = desiredPosition.copy();
         this.position.x = min(width - this.size / 2, this.position.x);
         this.position.x = max(0 + this.size / 2, this.position.x);
         this.position.y = min(height - this.size / 2, this.position.y);
         this.position.y = max(0 + this.size / 2, this.position.y);
      } else {
         // Place to handle collisions
      }
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