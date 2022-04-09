var grid;
var actor;

function setup() {
   createCanvas(1000, 1000);

   let gridXSize = 200;
   let gridYSize = 200;
   let binaryThreshold = 0.4;
   grid = new MarchingSquares(gridXSize, gridYSize, binaryThreshold);
   grid.setupGrid();
   grid.removeSingleIslands();
   grid.buildMap();
}

function draw() {
   background(125);
   grid.drawLines();
   grid.drawGrid();

   if (typeof actor !== 'undefined') {
      actor.move();
      actor.draw();
   }

}

function mouseClicked() {
   if (typeof actor === 'undefined') {
      console.log("Spawn actor");
      actor = new Actor(mouseX, mouseY, 20);
   }
}
