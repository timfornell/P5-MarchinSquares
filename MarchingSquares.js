class MarchingSquares {
   constructor(gridXSize, gridYSize, binaryThreshold) {
      this.binaryThreshold = binaryThreshold;
      this.pointGrid = [];
      this.cellGrid = [];
      this.gridXSize = gridXSize;
      this.gridYSize = gridYSize;
      // Add +1 to get points at the edges of the canvas
      this.numXPoints = floor(width / gridXSize) + 1;
      this.numYPoints = floor(width / gridYSize) + 1;
      this.numXCells = this.numXPoints - 1;
      this.numYCells = this.numYPoints - 1;
   }

   setupGrid() {
      for (let x = 0; x < this.numXPoints; x++) {
         this.pointGrid[x] = [];
         for (let y = 0; y < this.numYPoints; y++) {
            // Values should never be equal to 0 or 1
            const epsilon = 1e-4;
            var value = random(0 + epsilon, 1 - epsilon);
            var binaryValue = 0;

            if (value <= this.binaryThreshold) {
               binaryValue = 1;
            }

            this.pointGrid[x][y] = {binary: binaryValue, value: value}
         }
      }
   }

   removeSingleIslands() {
      for (let x = 1; x < this.numXPoints - 1; x++) {
         for (let y = 1; y < this.numYPoints - 1; y++) {
            var surroundedByOnes = (this.pointGrid[x - 1][y].binary == 1 &&
                                    this.pointGrid[x + 1][y].binary == 1 &&
                                    this.pointGrid[x][y - 1].binary == 1 &&
                                    this.pointGrid[x][y + 1].binary == 1);
            var surroundedByZeros = (this.pointGrid[x - 1][y].binary == 0 &&
                                     this.pointGrid[x + 1][y].binary == 0 &&
                                     this.pointGrid[x][y - 1].binary == 0 &&
                                     this.pointGrid[x][y + 1].binary == 0);
            if (surroundedByOnes) {
               this.pointGrid[x][y].binary = 1;
            } else if(surroundedByZeros) {
               this.pointGrid[x][y].binary = 0;
            }
         }
      }
   }

   drawGrid() {
      for (let x = 0; x < this.numXPoints; x++) {
         for (let y = 0; y < this.numYPoints; y++) {
           stroke(this.pointGrid[x][y].binary * 255);
           fill(this.pointGrid[x][y].binary * 255);
           circle(x * this.gridXSize, y * this.gridYSize, 1);
         }
       }
   }

   buildMap() {
      // (x, y) will be the top left corner of each cell
      for (let x = 0; x < this.numXCells; x++) {
         this.cellGrid[x] = [];

         for (let y = 0; y < this.numXCells; y++) {
            var index = 0;
            // Represent the corners by a 4-bit number, top left is MSB and bottom left is LSB
            index = index | this.pointGrid[x][y].binary << 3;
            index = index | this.pointGrid[x + 1][y].binary << 2;
            index = index | this.pointGrid[x + 1][y + 1].binary << 1;
            index = index | this.pointGrid[x][y + 1].binary << 0;

            this.cellGrid[x][y] = index;
         }
      }
   }

   /**
    * "Interpolated" value between two corners
    * @param {number} lowValue refers to the corner with the lowest x or y coordinate
    * @param {number} highValue refers to the corner with the largest x or y coordinate
    */
   getInterpolatedValue(lowValue, highValue) {
      const valueRange = 2; // diff can have values in [-1, 1]
      const desiredValueRange = 1; // Size of desired range [0, 1]
      var diff = highValue - lowValue;

      // This is valid as long ass the diff values are centered around 0
      var mappedValue = (diff + desiredValueRange) / (valueRange / desiredValueRange);

      return mappedValue;
   }

   drawLines() {
      var cellWidth = this.gridXSize;
      var cellHeight = this.gridYSize;
      var halfCellWidth = this.gridXSize / 2; // half cell width
      var halfCellHeight = this.gridYSize / 2; // half cell height

      for (let x = 0; x < this.numXCells; x++) {
         for (let y = 0; y < this.numYCells; y++) {
            stroke(56);
            fill(56);
            var index = this.cellGrid[x][y];
            var topLeft = createVector(x * cellWidth, y * cellHeight);
            var bottomRight = createVector(topLeft.x + cellWidth, topLeft.y + cellHeight);

            var leftEdgeValueFactor = this.getInterpolatedValue(this.pointGrid[x][y].value, this.pointGrid[x][y + 1].value);
            var rightEdgeValueFactor = this.getInterpolatedValue(this.pointGrid[x + 1][y].value, this.pointGrid[x + 1][y + 1].value);
            var topEdgeValueFactor = this.getInterpolatedValue(this.pointGrid[x][y].value, this.pointGrid[x + 1][y].value);
            var bottomEdgeValueFactor = this.getInterpolatedValue(this.pointGrid[x][y + 1].value, this.pointGrid[x + 1][y + 1].value);
            var leftEdgePoint = createVector(topLeft.x, topLeft.y + cellHeight * leftEdgeValueFactor);
            var rightEdgePoint = createVector(bottomRight.x, topLeft.y + cellHeight * rightEdgeValueFactor);
            var topEdgePoint = createVector(topLeft.x + cellWidth * topEdgeValueFactor, topLeft.y);
            var bottomEdgePoint = createVector(topLeft.x + cellWidth * bottomEdgeValueFactor, bottomRight.y);

            if (index == 0) {
               // Empty cell
            } else if (index == 1) {
               line(leftEdgePoint.x, leftEdgePoint.y, bottomEdgePoint.x, bottomEdgePoint.y);
            } else if (index == 2) {
               line(bottomEdgePoint.x, bottomEdgePoint.y, rightEdgePoint.x, rightEdgePoint.y);
            } else if (index == 3) {
               line(leftEdgePoint.x, leftEdgePoint.y, rightEdgePoint.x, rightEdgePoint.y);
            } else if (index == 4) {
               line(topEdgePoint.x, topEdgePoint.y, rightEdgePoint.x, rightEdgePoint.y);
            } else if (index == 5) {
               line(leftEdgePoint.x, leftEdgePoint.y, topEdgePoint.x, topEdgePoint.y);
               line(bottomEdgePoint.x, bottomEdgePoint.y, rightEdgePoint.x, rightEdgePoint.y);
            } else if (index == 6) {
               line(topEdgePoint.x, topEdgePoint.y, bottomEdgePoint.x, bottomEdgePoint.y);
            } else if (index == 7) {
               line(leftEdgePoint.x, leftEdgePoint.y, topEdgePoint.x, topEdgePoint.y);
            } else if (index == 8) {
               line(leftEdgePoint.x, leftEdgePoint.y, topEdgePoint.x, topEdgePoint.y);
            } else if (index == 9) {
               line(topEdgePoint.x, topEdgePoint.y, bottomEdgePoint.x, bottomEdgePoint.y);
            } else if (index == 10) {
               line(leftEdgePoint.x, leftEdgePoint.y, bottomEdgePoint.x, bottomEdgePoint.y);
               line(topEdgePoint.x, topEdgePoint.y, rightEdgePoint.x, rightEdgePoint.y);
            } else if (index == 11) {
               line(topEdgePoint.x, topEdgePoint.y, rightEdgePoint.x, rightEdgePoint.y);
            } else if (index == 12) {
               line(leftEdgePoint.x, leftEdgePoint.y, rightEdgePoint.x, rightEdgePoint.y);
            } else if (index == 13) {
               line(bottomEdgePoint.x, bottomEdgePoint.y, rightEdgePoint.x, rightEdgePoint.y);
            } else if (index == 14) {
               line(leftEdgePoint.x, leftEdgePoint.y, bottomEdgePoint.x, bottomEdgePoint.y);
            } else if (index == 15) {
               // Empty cell
            }
         }
      }
   }
}

