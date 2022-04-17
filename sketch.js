var grid;
var actor;

function setup() {
   createCanvas(900, 900);

   let gridXSize = 30;
   let gridYSize = 30;
   let binaryThreshold = 0.4;
   grid = new MarchingSquares(gridXSize, gridYSize, binaryThreshold);
   grid.setupGrid();
   grid.removeSingleIslands();
   grid.buildMap();
   grid.calculateLines();
}

function draw() {
   background(125);
   // grid.drawGrid();
   grid.drawLines();

   if (typeof actor !== 'undefined') {
      actor.move(grid.getSurroundingCells(actor.position));
      actor.draw();
   }

}

function mouseClicked() {
   if (typeof actor === 'undefined') {
      console.log("Spawn actor");
      actor = new Actor(mouseX, mouseY, 10);
   }
}
