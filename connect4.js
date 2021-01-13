/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7
const HEIGHT = 6

let gameIsRunning = true
let currPlayer = 1 // active player: 1 or 2
const board = [] // array of columns, each column is array of object cells  (board[x][y])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[x][y])
 */

function makeBoard() {
  // Set "board" to empty HEIGHT x WIDTH matrix array
  for (let x = 0; x < WIDTH; x++) {
    const column = []
    for (let y = 0; y < HEIGHT; y++) {
      const row = { filled: false, player: null }
      column.push(row)
    }
    board.push(column)
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  
  const htmlBoard = document.getElementById("board")
  
  // Create top row
  const top = document.createElement("tr")
  top.setAttribute("id", "column-top")
  top.addEventListener("click", handleClick)
  // Insert x number of cells into top row
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td")
    headCell.setAttribute("id", x)
    top.append(headCell)
  }
  htmlBoard.append(top)

  // Create and add y number of rows below top row
  for (let y = HEIGHT - 1; y >= 0; y--) {
    const row = document.createElement("tr")
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td")
      cell.setAttribute("id", `${x}-${y}`)
      row.append(cell)
    }
    htmlBoard.append(row)
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
  let y = board[x].findIndex((element) => {
    return element.filled === false
  })
  
  if (y === -1) {
    return null
  }

  return y
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInHtmlTable(x, y) {
  const newPiece = document.createElement('div')
  newPiece.className = `piece p${currPlayer}`

  const cell = document.getElementById(`${x}-${y}`)
  cell.appendChild(newPiece)
}

function placeInBoard(x, y) {
  board[x][y].filled = true
  board[x][y].player = currPlayer
}

/** endGame: announce game end */

function endGame(msg) {
  gameIsRunning = false
  setTimeout(() => {
    alert(msg)
  }, 200)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if (gameIsRunning === false) {
    return
  }
  // get x from ID of clicked cell
  const x = +evt.target.id

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x)
  if (y === null) {
    return
  }

  // place piece in board and add to HTML table
  placeInBoard(x, y)
  placeInHtmlTable(x, y)

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`)
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (checkForTie()) {
    return endGame('Game is a tie!')
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (x, y) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([x, y]) =>
        x >= 0 &&
        x < WIDTH &&
        y >= 0 &&
        y < HEIGHT &&
        board[x][y].player === currPlayer
    )
  }

  // TODO: read and understand this code. Add comments to help you.
  //Iterate through all x coordinates
  for (let x = 0; x < WIDTH; x++) {
    //Iterate through all y coordinates
    for (let y = 0; y < HEIGHT; y++) {
      //Insert coordinates for horizontal check
      const horiz = [
        [x, y],
        [x + 1, y],
        [x + 2, y],
        [x + 3, y],
      ]
      //Insert coordinates for vertical check
      const vert = [
        [x, y],
        [x, y + 1],
        [x, y + 2],
        [x, y + 3],
      ]
      //Insert coordinates for diagonal (Up & Right) check
      const diagDR = [
        [x, y],
        [x + 1, y + 1],
        [x + 2, y + 2],
        [x + 3, y + 3],
      ]
      //Insert coordinates for diagonal (Up & Left) check
      const diagDL = [
        [x, y],
        [x - 1, y + 1],
        [x - 2, y + 2],
        [x - 3, y + 3],
      ]
      //Input above coordinate arrays into _win to check.
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true
      }
    }
  }
}

function checkForTie() {
  function _tie(cells) {
    return cells.every(
      ([x, y]) =>
        x >= 0 &&
        x < WIDTH &&
        y >= 0 &&
        y < HEIGHT &&
        board[x][y].filled === true
    )
  }

  const allCells = []
  
  for (let x = 0; x < WIDTH; x++) {
    for (let y = 0; y < HEIGHT; y++) {
      const cell = [x, y]
      allCells.push(cell)
    }
  }

  if (_tie(allCells)) {
        return true
      }
}

makeBoard()
makeHtmlBoard()
