class Actor {
   constructor(x, y, size) {
      this.size = size;
      this.speed = 1;
      this.position = createVector(x, y);
   }

   draw() {
      stroke(0);
      fill(255, 0, 0);
      circle(this.position.x, this.position.y, this.size);
   }

   move() {
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

      this.position.add(xDirection * this.speed, yDirection * this.speed);
   }
}