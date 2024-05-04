const up = 0;
const down = 1;
const right = 2;
const left = 3;

let arr = [];
let board = [];
let merge = [];
let stepCount = 0;

let table = document.getElementById('table');
let stepCountBanner = document.getElementById('stepCountBanner');

let rightButton = document.getElementById('rightButton');
let leftButton = document.getElementById('leftButton');
let upButton = document.getElementById('upButton');
let downButton = document.getElementById('downButton');
let resetButton = document.getElementById('resetButton');

let newRow;
let newCol;

resetGame();

rightButton.onclick = function () { tableShift(right); };
leftButton.onclick = function () { tableShift(left); };
upButton.onclick = function () { tableShift(up); };
downButton.onclick = function () { tableShift(down); };
resetButton.onclick = resetGame;

window.addEventListener("keydown", myKeyListener);

function myKeyListener(event) {
	
	if (event.key === "ArrowUp") {
		tableShift(up);
	} else if (event.key === "ArrowDown") {
		tableShift(down);
	} else if (event.key === "ArrowLeft") {
		tableShift(left);
	} else if (event.key === "ArrowRight") {
		tableShift(right);
	}
}

function resetGame() {
	stepCount = 0;
	stepCountBanner.innerHTML = "Step Count: " + stepCount;
	for (let i = 0; i < 4; i++) {
		arr[i] = [];
		board[i] = [];
		merge[i] = new Array(4);
		let row = table.children[0].children[i];
		for (let j = 0; j < 4; j++) {
			arr[i][j] = 1; 
			board[i][j] = row.children[j];
		}
	}

	random2();
	random2();
	random2();
	updateBoard();
}

/**
 * print out values of arr and board for debug
 */
function show() {
	for (let i = 0; i < 4; i++) {
		print(arr[i]);
	}

	for (let i = 0; i < 4; i++) {
		print(board[i]);
	}
}

function setArr(row, col, val) {
	arr[row][col] = val;
}

/**
 * create a 2 at a random empty spot
 */
function random2() {
	while (true) {
		let row = Math.floor(Math.random() * 4);
		let col = Math.floor(Math.random() * 4);
		if (arr[row][col] === 1) {
			newRow = row;
			newCol = col;
			setArr(row, col, 2);
			print("new block at: " + newRow + ", " + newCol);
			return;
		}
	}
}

/**
 * sync board with arr
 */
function updateBoard() {
	let count = 0;
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (isEmpty(i, j)) {
				board[i][j].innerHTML = "";
				board[i][j].style.backgroundColor = "white";
				count++;
			} else if (i === newRow && j === newCol) {
				board[i][j].innerHTML = arr[i][j];
				board[i][j].style.backgroundColor = "lightblue";
			} else if (merge[i][j] === true) {
				board[i][j].innerHTML = arr[i][j];
				board[i][j].style.backgroundColor = "red";
			} else {
				board[i][j].innerHTML = arr[i][j];
				board[i][j].style.backgroundColor = "yellow";
			}
		}
	}
	stepCountBanner.innerHTML = "Step Count: " + stepCount;

	if (count == 0 && moreActionPossible() == false) {
		setTimeout(function () {
			alert("Game Over!");
		}, 1000);
	}
}

/**
 * replace all temps with their values
 */
function removeTemp() {
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (isTemp(i, j)) {
				setArr(i, j, arr[i][j].value);
				merge[i][j] = true;
			} else {
				merge[i][j] = false;
			}
		}
	}
}

function shift(row, col, direction) {
	if (isEmpty(row, col)) {
		return false;
	}
	let rowOffset = 0;
	let colOffSet = 0;
	if (direction === left) {
		colOffSet = -1;
	} else if (direction === right) {
		colOffSet = 1;
	} else if (direction === up) {
		rowOffset = -1;
	} else if (direction === down) {
		rowOffset = 1;
	}
	let newRow = row + rowOffset;
	let newCol = col + colOffSet;
	if (newRow < 0 || newRow > 3 || newCol < 0 || newCol > 3) {
		return false;
	}
	if (isEmpty(newRow, newCol)) {
		let currVal = arr[row][col];
		setArr(newRow, newCol, currVal);
		setArr(row, col, 1);
		shift(newRow, newCol, direction);
		return true;
	} else if (arr[row][col] === arr[newRow][newCol]) {
		let temp = new Temp(2 * arr[row][col]);
		setArr(newRow, newCol, temp);
		setArr(row, col, 1);
		return true;
	}
	return false;
}

function tableShift(direction) {
	let success = false;
	if (direction === right) {
		for (let row = 0; row < 4; row++) {
			for (let col = 3; col >= 0; col--) {
				success = shift(row, col, direction) || success;
			}
		}
	} else if (direction === left) {
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				success = shift(row, col, direction) || success;
			}
		}
	} else if (direction === up) {
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				success = shift(row, col, direction) || success;
			}
		}
	} else if (direction == down) {
		for (let row = 3; row >= 0; row--) {
			for (let col = 0; col < 4; col++) {
				success = shift(row, col, direction) || success;
			}
		}
	}
	if (success) {
		stepCount++;
		removeTemp();
		random2();
		updateBoard();
	}
}

function moreActionPossible() {
	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 4; col++) {
			if (canMergeToRightOrDown(row, col)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * return if the block can merge to right or down
 */
function canMergeToRightOrDown(row, col) {
	if (row + 1 < 4 && arr[row][col] === arr[row + 1][col]) {
		return true;
	}
	if (col + 1 < 4 && arr[row][col] == arr[row][col + 1]) {
		return true;
	}
	return false;
}

function Temp(value) {
	this.value = value;
}

function isTemp(row, col) {
	return arr[row][col].constructor.name === "Temp";
}

function isEmpty(row, col) {
	return arr[row][col] === 1;
}

function print(arg) {
	console.log(arg);
}
