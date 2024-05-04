const up = 0;
const down = 1;
const right = 2;
const left = 3;

let arr = [];
let board = [];
let table = document.getElementById('table');
let rightButton = document.getElementById('rightButton');
let leftButton = document.getElementById('leftButton');
let upButton = document.getElementById('upButton');
let downButton = document.getElementById('downButton');

initArr();

rightButton.onclick = function () { tableShift(right); };
leftButton.onclick = function () { tableShift(left); };
upButton.onclick = function () { tableShift(up); };
downButton.onclick = function () { tableShift(down); };

function initArr() {
	for (let i = 0; i < 4; i++) {
		arr[i] = [];
		board[i] = [];
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
			setArr(row, col, 2);
			return;
		}
	}
}

/**
 * sync board with arr
 */
function updateBoard() {
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (isEmpty(i, j)) {
				board[i][j].innerHTML = "";
			} else {
				board[i][j].innerHTML = arr[i][j];
			}
		}
	}
}

/**
 * replace all temp with their values
 */
function removeTemp() {
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (isTemp(i, j)) {
				setArr(i, j, arr[i][j].value);
			}
		}
	}
}

function shift(row, col, direction) {
	if (isEmpty(row, col)) {
		return;
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
		return;
	}
	if (isEmpty(newRow, newCol)) {
		let currVal = arr[row][col];
		setArr(newRow, newCol, currVal);
		setArr(row, col, 1);
		shift(newRow, newCol, direction);
	} else if (arr[row][col] === arr[newRow][newCol]) {
		let temp = new Temp(2 * arr[row][col]);
		setArr(newRow, newCol, temp);
		setArr(row, col, 1);
	}
}

function tableShift(direction) {
	if (direction === right) {
		for (let row = 0; row < 4; row++) {
			for (let col = 3; col >= 0; col--) {
				shift(row, col, direction);
			}
		}
	} else if (direction === left) {
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				shift(row, col, direction);
			}
		}
	} else if (direction === up) {
		for (let row = 0; row < 4; row++) {
			for (let col = 0; col < 4; col++) {
				shift(row, col, direction);
			}
		}
	} else if (direction == down) {
		for (let row = 3; row >= 0; row--) {
			for (let col = 0; col < 4; col++) {
				shift(row, col, direction);
			}
		}
	}
	removeTemp();
	random2();
	updateBoard();
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
