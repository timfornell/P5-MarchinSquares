class Actor {
   constructor(x, y, size) {
      this.size = size;
      this.speed = 10;
      this.position = createVector(x, y);
   }

   draw() {
      stroke(0);
      fill(255, 0, 0, 0);
      circle(this.position.x, this.position.y, this.size);
   }

   move(surroundingCells) {
      var velocityVector = createVector(0, 0);
      var xDirection = 0;
      var yDirection = 0;

      if (keyIsDown(LEFT_ARROW)) {
         velocityVector.x = -1;
      }

      if (keyIsDown(RIGHT_ARROW)) {
         velocityVector.x = 1;
      }

      if (keyIsDown(UP_ARROW)) {
         velocityVector.y = -1;
      }

      if (keyIsDown(DOWN_ARROW)) {
         velocityVector.y = 1;
      }

      if (velocityVector.mag() > 0) {
         velocityVector.setMag(this.speed);
         this.tryToMove(surroundingCells, velocityVector);
      }
   }

   tryToMove(surroundingCells, velocityVector) {
      var desiredPosition = this.position.copy();
      desiredPosition.add(velocityVector.x, velocityVector.y);
      var collisions = [];

      for (let cell of surroundingCells) {
         for (let gridLine of cell.lines) {
            var closestPointOnLine = this.getVectorToClosestPointOnLine(gridLine, this.position);

            // This works as long as the object isn't moving 'too' fast
            if (this.pointIsInsideActor(desiredPosition, closestPointOnLine))
            {
               collisions.push({gridLine: gridLine, closestPoint: closestPointOnLine});
            }
         }
      }

      if (collisions.length == 0) {
         this.position = desiredPosition.copy();

         // Clamp to canvas
         this.position.x = min(width - this.size / 2, this.position.x);
         this.position.x = max(0 + this.size / 2, this.position.x);
         this.position.y = min(height - this.size / 2, this.position.y);
         this.position.y = max(0 + this.size / 2, this.position.y);
      } else {
         // Place to handle collisions
         this.handleLineCollisions(collisions, desiredPosition, velocityVector);
      }
   }

   pointIsInsideActor(desiredPosition, positionOnLine) {
      return (desiredPosition.x - positionOnLine.x) ** 2 + (desiredPosition.y - positionOnLine.y) ** 2 <= (this.size / 2) ** 2
   }

   handleLineCollisions(collisions, desiredPosition, velocityVector) {
      // https://ericleong.me/research/circle-line/
      if (collisions.length == 1) {
         // If only one collision, move as close to line as possible
         var distanceToActorEdge = createVector(this.size / 2, 0).rotate(velocityVector.heading());
         var desiredPositionAtRadius = desiredPosition.copy();
         desiredPositionAtRadius.add(distanceToActorEdge);
         var positionLine = {start: this.position, end: desiredPositionAtRadius};

         // Find intersection between movement vector and line
         fill(255, 0, 0);
         line(this.position.x, this.position.y, collisions[0].closestPoint.x, collisions[0].closestPoint.y);

         var intersectionPoint = this.getIntersectionBetweenLines(positionLine, collisions[0].gridLine);
         if (intersectionPoint != null) {
            // Done according to https://ericleong.me/research/circle-line/#moving-circle-and-static-line-segment
            var newPosition = intersectionPoint.copy();
            var constant = (this.size / 2) * this.position.dist(intersectionPoint) / this.position.dist(collisions[0].closestPoint);
            velocityVector.mult(constant / velocityVector.mag());
            newPosition.sub(velocityVector);

            // Check if position is ok w.r.t. canvas size
            if (0 < newPosition.x && newPosition.x < width && 0 < newPosition.y && newPosition.y < height) {
               this.position = newPosition.copy();
            }
         }
      } else if (collisions.length == 2) {
         // If there are two collisions, it can be handled iff the collisionpoints are the same
         line(this.position.x, this.position.y, collisions[0].closestPoint.x, collisions[0].closestPoint.y);
         line(this.position.x, this.position.y, collisions[1].closestPoint.x, collisions[1].closestPoint.y);
      } else {
         // If more than two collisions, the actor is most likely stuck and should not move
      }
   }

   getIntersectionBetweenLines(line1, line2) {
      var intersectionPoint = null;

      // Explained at https://ericleong.me/research/circle-line/#line-line-intersection
      var a1 = line1.end.y - line1.start.y;
      var b1 = line1.start.x - line1.end.x;
      var c1 = a1 * line1.start.x + b1 * line1.start.y;
      var a2 = line2.end.y - line2.start.y;
      var b2 = line2.start.x - line2.end.x;
      var c2 = a2 * line2.start.x + b2 * line2.start.y;

      fill(0, 255, 0);
      line(line1.start.x, line1.start.y, line1.end.x, line1.end.y);
      circle(line1.end.x, line1.end.y, 10);
      fill(0, 0, 255);
      line(line2.start.x, line2.start.y, line2.end.x, line2.end.y);
      circle(line2.start.x, line2.start.y, 5);
      circle(line2.end.x, line2.end.y, 5);

      var determinant = a1 * b2 - a2 * b1;
      if (determinant != 0) {
         var x = (c1 * b2 - b1 * c2) / determinant;
         var y = (a1 * c2 - c1 * a2) / determinant;
         intersectionPoint = createVector(x, y);
      }

      circle(intersectionPoint.x, intersectionPoint.y, 5);
      return intersectionPoint;
   }

   getVectorToClosestPointOnLine(gridLine, position) {
      var lineVector = createVector(gridLine.end.x - gridLine.start.x, gridLine.end.y - gridLine.start.y);
      var lineNormalDotproduct = this.getDistanceToClosestPointOnLine(gridLine, position);
      var distance = abs(lineNormalDotproduct);
      var angle = PI / 2 + this.position.angleBetween(lineVector);

      // v1 will be the vector to the closest point
      var v1 = position.copy();
      v1.setMag(distance);

      // Use the sign of lineNormalDotproduct to determine which direction v1 should point
      if (lineNormalDotproduct < 0) {
         v1.rotate(angle);
      } else if (lineNormalDotproduct > 0) {
         v1.rotate(PI + angle);
      }

      v1.add(this.position);

      // If the distance from v1 to either of the end points are bigger than the length of the grid line,
      // the closest point is "outside" the end points.
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

      // Get the normal vector of the grid line
      var norm = createVector(y2 - y1, - (x2 - x1));
      // Form a line from one end point of the grid line to the point
      var d = createVector(x0 - x1, y0 - y1);

      /*
       * d has two components, one parallell and one orthogonal to the grid line. Meaning, a dot product between d and
       * the normal vector should "remove" the component parallell to the grid line since it is orthogonal to the normal
       * vector. Detailed explanation here:
       * https://math.stackexchange.com/questions/274712/calculate-on-which-side-of-a-straight-line-is-a-given-point-located
       */
      var dotProd = norm.x * d.x + norm.y * d.y;

      return dotProd / sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
   }
}