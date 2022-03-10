
let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");
let currentCell;

class Maze{
    constructor(columns, rows, size){
        this.columns = columns;
        this.rows = rows;
        this.size = size;
        this.grid = [];
        this.stack = [];
    }

    setup(){
        for(let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.columns; c++){
                let cell = new Cell(c, r, this.grid, this.size);
                row.push(cell);
            }
            this.grid.push(row);
        }
        currentCell = this.grid[0][0];
    }

    draw(){
        maze.width = this.size;
        maze.height = this.size;
        maze.style.background = "black" // #333;
        currentCell.cellVisited = true;

        for(let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns; c++){
                let grid = this.grid;
                grid[r][c].show(this.size, this.columns, this.rows);
            }
        }

        let nextCell = currentCell.checkNeighbors();

        if (nextCell) {
            nextCell.cellVisited = true;
            this.stack.push(currentCell);
            currentCell.highlight(this.columns, this.rows);
            currentCell.deleteBorder(currentCell, nextCell);
            currentCell = nextCell;
        }
        else if (this.stack.length > 0) {
            let cell = this.stack.pop();
            currentCell = cell;
            currentCell.highlight(this.columns, this.rows);
        }

        if (this.stack.length === 0) return;

        window.requestAnimationFrame (()=> {
            this.draw();
        });
    }
}

class Cell {
    constructor(numCol, numRow, grid, size){
        this.numCol = numCol;
        this.numRow = numRow;
        this.grid = grid;
        this.size = size;
        this.cellVisited = false;
        this.cellBorders = [true, true, true, true]; // top, bottom, right, left     
    }

    checkNeighbors(){
        let grid = this.grid;
        let row = this.numRow;
        let col = this.numCol;
        let neighbors = [];

        let top = row !== 0 ? grid[row - 1][col] : undefined;
        let bottom = row !== grid.length - 1 ? grid[row + 1][col] : undefined;
        let left = col !== 0 ? grid[row][col - 1] : undefined;
        let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;

        if(top && !top.cellVisited) neighbors.push(top); //if neighbouring is not visited, add cell to neighbor stack
        if(bottom && !bottom.cellVisited) neighbors.push(bottom);
        if(left && !left.cellVisited) neighbors.push(left);
        if(right && !right.cellVisited) neighbors.push(right);

        if(neighbors.length !== 0) {
            let random = Math.floor(Math.random() * neighbors.length);
            return neighbors[random];
        }
        else {
            return undefined;
        }
        
    }

    drawTopBorder(x, y, size, numCol, numRow){
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + size/numCol, y);
        ctx.stroke();
    }

    drawBottomBorder(x, y, size, numCol, numRow){
        ctx.beginPath();
        ctx.moveTo(x, y + size/numRow);
        ctx.lineTo(x + size/numCol, y + size/numRow);
        ctx.stroke();
    }

    drawLeftBorder(x, y, size, numCol, numRow){
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + size/numRow);
        ctx.stroke();
    }
    drawRightBorder(x, y, size, numCol, numRow){
        ctx.beginPath();
        ctx.moveTo(x + size/numCol, y);
        ctx.lineTo(x + size/numCol, y + size/numRow);
        ctx.stroke();
    }

    deleteBorder(currentCell, neighborCell){
        let x = (currentCell.numCol - neighborCell.numCol);
        let y = (currentCell.numRow - neighborCell.numRow); 
        // 0 - top, 1 - bottom, 2 - right, 3 - left

        if (x === 1){
            currentCell.cellBorders[3] = false;
            neighborCell.cellBorders[2] = false;
        }
        else if(x === -1){
            currentCell.cellBorders[2] = false;
            neighborCell.cellBorders[3] = false;
        }

        if (y === 1){
            currentCell.cellBorders[0] = false;
            neighborCell.cellBorders[1] = false;
        }
        else if(y === -1){
            currentCell.cellBorders[1] = false;
            neighborCell.cellBorders[0] = false;
        }
    }

    highlight(numCol, numRow){
        let x = (this.numCol * this.size) / numCol + 1;
        let y = (this.numRow * this.size) / numRow + 1;

        ctx.fillStyle = "purple";
        ctx.fillRect(x, y, this.size/numCol - 3, this.size/numCol - 3);
    }

    show(size, numCol, numRow){
        let x = (this.numCol * size)/numCol;
        let y = (this.numRow * size)/numRow;
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = "black"; //highlight current cell
        ctx.lineWidth = 2;
        //ctx.lineCap = 'square';
        
        if (this.cellBorders[0]) this.drawTopBorder(x, y, size, numCol, numRow);
        if (this.cellBorders[1]) this.drawBottomBorder(x, y, size, numCol, numRow);
        if (this.cellBorders[3]) this.drawLeftBorder(x, y, size, numCol, numRow);
        if (this.cellBorders[2]) this.drawRightBorder(x, y, size, numCol, numRow);
        if (this.cellVisited) {
            ctx.fillRect(x + 1, y + 1, size/numCol - 2, size/numRow - 2); //show cursors progress visiting cells
        }
    }
}

let newMaze = new Maze(20, 20, 500);
newMaze.setup();
newMaze.draw();

function displaySolution (){
 
}

function clearMaze (){

}
