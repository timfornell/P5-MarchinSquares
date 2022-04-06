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
            var value = random(0, 1);

            if (value <= this.binaryThreshold) {
               this.pointGrid[x][y] = 1;
            } else {
               this.pointGrid[x][y] = 0;
            }
         }
      }
   }

   drawGrid() {
      for (let x = 0; x < this.numXPoints; x++) {
         for (let y = 0; y < this.numYPoints; y++) {
           stroke(this.pointGrid[x][y] * 255);
           point(x * this.gridXSize, y * this.gridYSize);
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
            index = index | this.pointGrid[x][y] << 3;
            index = index | this.pointGrid[x + 1][y] << 2;
            index = index | this.pointGrid[x + 1][y + 1] << 1;
            index = index | this.pointGrid[x][y + 1] << 0;

            this.cellGrid[x][y] = index;
         }
      }
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

            if (index == 0) {
               // Empty cell
            } else if (index == 1) {
               line(topLeft.x, topLeft.y + halfCellHeight,
                    topLeft.x + halfCellWidth, topLeft.y + cellHeight);
            } else if (index == 2) {
               line(topLeft.x + halfCellWidth, topLeft.y + cellHeight,
                    topLeft.x + cellWidth, topLeft.y + halfCellHeight);
            } else if (index == 3) {
               line(topLeft.x, topLeft.y + halfCellHeight,
                    topLeft.x + cellWidth, topLeft.y + halfCellHeight);
            } else if (index == 4) {
               line(topLeft.x + halfCellWidth, topLeft.y,
                    topLeft.x + cellWidth, topLeft.y + halfCellHeight);
            } else if (index == 5) {
               line(topLeft.x + halfCellWidth, topLeft.y,
                    topLeft.x, topLeft.y + halfCellHeight);
               line(topLeft.x + halfCellWidth, topLeft.y + cellHeight,
                    topLeft.x + cellWidth, topLeft.y + halfCellHeight);
            } else if (index == 6) {
               line(topLeft.x + halfCellWidth, topLeft.y,
                    topLeft.x + halfCellWidth, topLeft.y + cellHeight);
            } else if (index == 7) {
               line(topLeft.x, topLeft.y + halfCellHeight,
                    topLeft.x + halfCellWidth, topLeft.y);
            } else if (index == 8) {
               line(topLeft.x, topLeft.y + halfCellHeight,
                    topLeft.x + halfCellWidth, topLeft.y);
            } else if (index == 9) {
               line(topLeft.x + halfCellWidth, topLeft.y,
                    topLeft.x + halfCellWidth, topLeft.y + cellHeight);
            } else if (index == 10) {
               line(topLeft.x, topLeft.y + halfCellHeight,
                    topLeft.x + halfCellWidth, topLeft.y + cellHeight);
               line(topLeft.x + halfCellWidth, topLeft.y ,
                    topLeft.x + cellWidth, topLeft.y + halfCellHeight);
            } else if (index == 11) {
               line(topLeft.x + halfCellWidth, topLeft.y,
                    topLeft.x + cellWidth, topLeft.y + halfCellHeight);
            } else if (index == 12) {
               line(topLeft.x, topLeft.y + halfCellHeight,
                    topLeft.x + cellWidth, topLeft.y + halfCellHeight);
            } else if (index == 13) {
               line(topLeft.x + halfCellWidth, topLeft.y + cellHeight,
                    topLeft.x + cellWidth, topLeft.y + halfCellHeight);
            } else if (index == 14) {
               line(topLeft.x, topLeft.y + halfCellHeight,
                    topLeft.x + halfCellWidth, topLeft.y + cellHeight);
            } else if (index == 15) {
               // Empty cell
            }
         }
      }
   }
}

