var grid;

function setup() {
   createCanvas(1000, 1000);

   let gridXSize = 50;
   let gridYSize = 50;
   let binaryThreshold = 0.4;
   grid = new MarchingSquares(gridXSize, gridYSize, binaryThreshold);
   grid.setupGrid();
   grid.removeSingleIslands();
   grid.buildMap();
   background(125);
   grid.drawLines();
   grid.drawGrid();
}

function draw() {

}
