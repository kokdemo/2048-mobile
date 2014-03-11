function shiftGravity(m, direction) {
    switch (direction) {
    case 0: // left
        for (var x = 1; x < m[0].length; x++)
            for (var y = 0; y < m.length; y++)
                shiftCell(m, x, y, 0);
        break;
    case 1: // up
        for (var y = 1; y < m.length; y++)
            for (var x = 0; x < m[0].length; x++)
                shiftCell(m, x, y, 1);
        break;
    case 2: // right
        for (var x = m[0].length - 2; x >= 0; x--)
            for (var y = 0; y < m.length; y++)
                shiftCell(m, x, y, 2);
        break;
    case 3: // down
        for (var y = m.length - 2; y >= 0; y--) {
            for (var x = 0; x < m[0].length; x++) {
                shiftCell(m, x, y, 3);
            }
        }
        break;
    }
}

function shiftCell(m, x, y, direction) {
    if (m[y][x] === 0)
        return;
    
    var value = m[y][x],
        xAdd = 0,
        yAdd = 0,
        x2, y2;
    
    switch (direction) {
    case 0:
        xAdd = -1;
        break;
    case 1:
        yAdd = -1;
        break;
    case 2:
        xAdd = +1;
        break;
    case 3:
        yAdd = +1;
        break;
    }
    
    x2 = x + xAdd;
    y2 = y + yAdd;
    
    while (x2 >= 0 && x2 < m.length && y2 >= 0 && y2 < m.length) {
        if (m[y2][x2] === value) {
            m[y2][x2] *= 2;
            m[y][x] = 0;
            return;
        } else if (m[y2][x2] !== 0) {
            break;
        }
        x2 += xAdd;
        y2 += yAdd;
    }
    
    m[y][x] = 0;
    m[y2-yAdd][x2-xAdd] = value;
}

function createSquareMatrix(side) {
    var m = [];
    
    for (var y = 0; y < side; y++) {
        m.push([]);
        for (var x = 0; x < side; x++) {
            m[y].push(0);
        }
    }
    
    return m;
}

function createDivGrid(parent, side) {
    var divList = [];
    
    for (var y = 0; y < side; y++) {
        var containerDiv = document.createElement('div');
        containerDiv.className = 'row';
        parent.appendChild(containerDiv);
        for (var x = 0; x < side; x++) {
            var squareDiv = document.createElement('div');
            squareDiv.className = 'column';
            squareDiv.innerHTML = '0';
            containerDiv.appendChild(squareDiv);
            divList.push(squareDiv);
        }
        var clearDiv = document.createElement('div');
        clearDiv.className = 'clear';
        containerDiv.appendChild(clearDiv);
    }
    
    return divList;
}

function updateDivs(m, divs, colors) {
    for (var y = 0; y < m.length; y++) {
        for (var x = 0; x < m[0].length; x++) {
            var index = y * m[0].length + x;
            divs[index].innerHTML = m[y][x];
            
            if (m[y][x] > 0) {
                var color = Math.log(m[y][x]) / Math.log(2);
                divs[index].style.backgroundColor = colors[color];
            } else {
                divs[index].style.backgroundColor = colors[0];
            }
        }
    }
}

function spawnRandomNumberTwo(m) {
    var emptySquares = [];
    for (var y = 0; y < m.length; y++)
        for (var x = 0; x < m[0].length; x++)
            if (m[y][x] === 0)
                emptySquares.push([x, y]);
    
    // Game over?
    if (emptySquares.length === 0)
        return false;
    
    var index = getRandomInt(0, emptySquares.length - 1);
    var square = emptySquares[index];
    var x = square[0];
    var y = square[1];
    m[y][x] = 2;
    return true;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function showGameOverScreen(width, msg) {
    var msgDiv = document.createElement('div');
    msgDiv.style.width = width;
    msgDiv.className = 'gameOver';
    msgDiv.innerHTML = msg;
    document.body.appendChild(msgDiv);
}

// ==========================================

var side = 4;
var colors = ['aliceblue',
              'antiquewhite',
              'aquamarine',
              'lightsalmon',
              'lightgreen',
              'darkseagreen',
              'deeppink',
              'deepskyblue',
              'orangered',
              'gold',
              'slategray'];
var m = createSquareMatrix(side);
var divs = createDivGrid(document.body, side);
var gameOver = false;

spawnRandomNumberTwo(m);
updateDivs(m, divs, colors);

document.onkeydown = function(event) {
    if (gameOver) {
        return;
    }
    
	switch (event.which) {
    case 37:
    case 38:
    case 39:
    case 40:
        event.preventDefault();
    	shiftGravity(m, event.which - 37);
        if (!spawnRandomNumberTwo(m)) {
            gameOver = true;
    		showGameOverScreen(150, "GAME OVER :\'(");
        } else {
        	updateDivs(m, divs, colors);
        }
        break;
    }
};
