var grid;

function setup() {
   createCanvas(1000, 1000);

   let gridXSize = 200;
   let gridYSize = 200;
   let binaryThreshold = 0.4;
   grid = new MarchingSquares(gridXSize, gridYSize, binaryThreshold);
   grid.setupGrid();
   grid.buildMap();
   background(125);
   grid.drawLines();
   grid.drawGrid();
}

function draw() {

}
