// Returns the total yielded score.
// TODO: better perhaps if it returns a list of which cells were affected?
function shiftGravity(m, direction) {
    var score = 0,
        moved = false,
        subScore;
    
    switch (direction) {
    case 0: // left
        for (var x = 1; x < m[0].length; x++) {
            for (var y = 0; y < m.length; y++) {
                subScore = shiftCell(m, x, y, 0);
                if (subScore >= 0) {
                	score += subScore;
                    moved = true;
                }
            }
        }
        break;
    case 1: // up
        for (var y = 1; y < m.length; y++) {
            for (var x = 0; x < m[0].length; x++) {
                subScore = shiftCell(m, x, y, 1);
                if (subScore >= 0) {
                	score += subScore;
                    moved = true;
                }
            }
        }
        break;
    case 2: // right
        for (var x = m[0].length - 2; x >= 0; x--) {
            for (var y = 0; y < m.length; y++) {
                subScore = shiftCell(m, x, y, 2);
                if (subScore >= 0) {
                	score += subScore;
                    moved = true;
                }
            }
        }
        break;
    case 3: // down
        for (var y = m.length - 2; y >= 0; y--) {
            for (var x = 0; x < m[0].length; x++) {
                subScore = shiftCell(m, x, y, 3);
                if (subScore >= 0) {
                	score += subScore;
                    moved = true;
                }
            }
        }
        break;
    }
    
    return (moved) ? score : -1;
}

// Returns the yielded score.
function shiftCell(m, x, y, direction) {
    if (m[y][x] === 0)
        return -1;
    
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
            return m[y2][x2];
        } else if (m[y2][x2] !== 0) {
            break;
        }
        x2 += xAdd;
        y2 += yAdd;
    }
    
    // We haven't moved at all.
    if (y2 - yAdd === y && x2 - xAdd === x) {
        return -1;
    }
    
    m[y][x] = 0;
    m[y2-yAdd][x2-xAdd] = value;
    
    return 0;
}

// Creates and returns an integer matrix filled with zeroes.
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

// Creates a grid of divs and returns them in a list.
function createDivGrid(parent, side) {
    var divList = [];
    
    for (var y = 0; y < side; y++) {
        var rowDiv = document.createElement('div');
        rowDiv.className = 'row';
        parent.appendChild(rowDiv);
        for (var x = 0; x < side; x++) {
            var colDiv = document.createElement('div');
            colDiv.className = 'column';
            colDiv.innerHTML = '0';
            rowDiv.appendChild(colDiv);
            divList.push(colDiv);
        }
        var clearDiv = document.createElement('div');
        clearDiv.className = 'clear';
        rowDiv.appendChild(clearDiv);
    }
    
    return divList;
}

function spawnRandomNumberTwo(m) {
    var emptySquares = [];
    for (var y = 0; y < m.length; y++)
        for (var x = 0; x < m[0].length; x++)
            if (m[y][x] === 0)
                emptySquares.push([x, y]);
    
    if (emptySquares.length === 0)
        return false;
    
    var index = getRandomInt(0, emptySquares.length - 1);
    var square = emptySquares[index];
    var x = square[0];
    var y = square[1];
    m[y][x] = 2;
    return true;
}

function canMakeAMove(m) {
    // Check first row.
    for (var x = 1; x < m[0].length; x++) {
        if (m[0][x-1] === 0 || m[0][x] === 0 || m[0][x-1] === m[0][x]) {
            return true;
        }
    }
    
    // Check first column.
    for (var y = 1; y < m.length; y++) {
        if (m[y][0] === 0 || m[y-1][0] === m[y][0]) {
            return true;
        }
    }
    
    // Check the rest.
    for (var y = 1; y < m.length; y++) {
        for (var x = 1; x < m[0].length; x++) {
            if (m[y][x] === 0 || m[y-1][x] === 0 || m[y][x-1] === 0 ||
                m[y-1][x] === m[y][x] || m[y][x-1] === m[y][x]) {
                return true;
            }
        }
    }
    
    return false;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateDivs(m, divs, colors) {
    for (var y = 0; y < m.length; y++) {
        for (var x = 0; x < m[0].length; x++) {
            var index = y * m[0].length + x;
            divs[index].innerHTML = m[y][x];
            
            var color;
            if (m[y][x] > 0) {
                color = Math.log(m[y][x]) / Math.log(2) % colors.length;
                divs[index].style.color = 'black';
            } else {
                color = 0;
                // Ugly solution for making the div look empty.
                divs[index].style.color = colors[color];
            }
            divs[index].style.backgroundColor = colors[color];
            divs[index].style.borderColor = colors[color];
        }
    }
}

// ==========================================

// Returns true if it is possible to move in the specified direction.
function update(direction) {
    var subScore = shiftGravity(m, direction);
    if (subScore === -1) {
        return false;
    } else {
        score += subScore;
        scoreSpan.innerHTML = "<div class='scoreSpan'>Score:"+score+"</div>";
        spawnRandomNumberTwo(m);
        updateDivs(m, divs, colors);
        if (!canMakeAMove(m)) {
            gameover();
        }
        return true;
    }
}

//game over
function gameover(){
    gameOver = true;
    divs[4].innerHTML = "G";

    divs[5].innerHTML = "a";
    divs[6].innerHTML = "m";
    divs[7].innerHTML = "e";
    divs[8].innerHTML = "O";
    divs[9].innerHTML = "v";
    divs[10].innerHTML = "e";
    divs[11].innerHTML = "r";
};


var side = 4;
var colors = ['#EEEF8C',
              '#45B29D',
              '#EFC94C',
              '#E27A3F',
              '#DF5A49',
              '#b2d235',
              '#decb00',
              '#ffd400',
              '#ffc20e',
              '#e0861a',
              '#c37e00',
              '#69541b'];
var m = createSquareMatrix(side);
var divs = createDivGrid(document.getElementById('gridDiv'), side);
var scoreSpan = document.getElementById('scoreSpan');
var gameOverDiv = document.getElementById('gameOverDiv');
var column = document.getElementsByClassName('column');
var score = 0;
var gameOver = false;

spawnRandomNumberTwo(m);
updateDivs(m, divs, colors);


//add touch listen
var touchStartX, touchStartY;
var toucher = document.getElementById("gridDiv");

toucher.addEventListener("touchstart", function(event) {
    if (event.touches.length > 1) return;

    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
    event.preventDefault();
});

toucher.addEventListener("touchmove", function(event) {
    event.preventDefault();
});

toucher.addEventListener("touchend", function(event) {
    if (event.touches.length > 0) return;

    var dx = event.changedTouches[0].clientX - touchStartX;
    var absDx = Math.abs(dx);
    var dy = event.changedTouches[0].clientY - touchStartY;
    var absDy = Math.abs(dy);
    if (Math.max(absDx, absDy) > 10) {
        update(absDx > absDy ? (dx > 0 ? 2 : 0) : (dy > 0 ? 3 : 1));
    }
});

//restart
function restart(){
    location.reload(false);
};

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
            update(event.which - 37);
            break;
        case 32:
            event.preventDefault();
            restart();
            break;
    }
};




