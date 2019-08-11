import { Component, ChangeDetectorRef } from '@angular/core';

interface Cell {
  isMine: boolean;
  isOpen: boolean;
  minesTouching?: number;
}

interface Coordinates {
  row: number;
  column: number;
}

@Component({
  selector: 'game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent {
  gameIsOver: boolean;
  minesRemaining: number;
  time: string;
  mines: number[];
  boardSize: number;
  cells: Cell[];
  boardArray: Array<any>;
  private changeDetectorRef: ChangeDetectorRef;

  constructor(changeDetectorRef: ChangeDetectorRef) {
    this.gameIsOver = true;
    this.minesRemaining = 0;
    this.boardSize = 0;
    this.time = '0:00';
    this.cells = [];
    this.boardArray = [];
    this.changeDetectorRef = changeDetectorRef;
  }

  newGame() {
    this.boardSize = 0;
    this.changeDetectorRef.detectChanges();
    this.gameIsOver = false;
    this.minesRemaining = 10;
    this.boardSize = 8;
    this.boardArray = Array(this.boardSize);
    this.cells = [];
    this.mines = [];
    for (let r = 0; r < this.boardSize; r++) {
      for (let c = 0; c < this.boardSize; c++) {
        this.cells.push({ isMine: false, isOpen: false });
      }
    }
    this.placeMines(this.minesRemaining);
    this.cells.forEach((cell, index) => {
      if (!cell.isMine) {
        this.cells[index].minesTouching = this.calculateTouchingMines(index);
      }
    });
  }

  updateMinesRemaining(isFlagged: boolean) {
    if (isFlagged) {
      this.minesRemaining--;
    } else {
      this.minesRemaining++;
    }
  }

  handleOpenedCell(index: number) {
    this.cells[index].isOpen = true;

    if (this.cells[index].minesTouching === 0) {
      this.openAllNeighboringCells(index);
    }

    if (this.cells.filter(cell => cell.isOpen === false).length === this.mines.length) {
      this.gameIsOver = true;
    }
  }

  handleOpenedMine() {
    this.gameIsOver = true;
    // show all mines
  }

  private placeMines(minesNeeded: number) {
    let minesPlaced = 0;
    while (minesPlaced < minesNeeded) {
      const newMine = this.pickRandomCell();
      if (this.mines.indexOf(newMine) === -1) {
        this.mines.push(newMine);
        this.cells[newMine].isMine = true;
        minesPlaced++;
      }
    }
  }

  private pickRandomCell(): number {
    return Math.floor(Math.random() * this.boardSize * this.boardSize);
  }

  private calculateTouchingMines(index: number): number {
    const coordinates = this.getCoordinatesFromIndex(index);
    let minesTouching = 0;
    if (coordinates.row > 0) { // if square is not in the top row
      minesTouching += this.checkSquareForMine(index - this.boardSize); // square above

      if (coordinates.column > 0) { // if square is not in the far left column
        minesTouching += this.checkSquareForMine(index - this.boardSize - 1); // square above and to the left
      }

      if (coordinates.column < this.boardSize - 1) { // if square is not in the far right column
        minesTouching += this.checkSquareForMine(index - this.boardSize + 1); // square above and to the right
      }
    }

    if (coordinates.row < this.boardSize - 1) { // if square is not in the bottom row
      minesTouching += this.checkSquareForMine(index + this.boardSize); // square below

      if (coordinates.column > 0) { // if square is not in the far left column
        minesTouching += this.checkSquareForMine(index + this.boardSize - 1); // square below and to the left
      }

      if (coordinates.column < this.boardSize - 1) { // if square is not in the far right column
        minesTouching += this.checkSquareForMine(index + this.boardSize + 1); // square below and to the right
      }
    }

    if (coordinates.column > 0) { // if square is not in the far left column
      minesTouching += this.checkSquareForMine(index - 1); // square to the left
    }

    if (coordinates.column < this.boardSize - 1) { // if square is not in the far right column
      minesTouching += this.checkSquareForMine(index + 1); // square to the right
    }

    return minesTouching;
  }

  private getCoordinatesFromIndex(index: number): Coordinates {
    return {
      row: Math.floor(index / this.boardSize),
      column: index % this.boardSize
    };
  }

  private checkSquareForMine(index: number): number {
    if (index > -1) {
      return this.mines.indexOf(index) === -1 ? 0 : 1;
    } else {
      return 0;
    }
  }

  private openAllNeighboringCells(index: number) {
    const coordinates = this.getCoordinatesFromIndex(index);
    if (coordinates.row > 0) { // if square is not in the top row
      this.openCell(index - this.boardSize); // square above

      if (coordinates.column > 0) { // if square is not in the far left column
        this.openCell(index - this.boardSize - 1); // square above and to the left
      }

      if (coordinates.column < this.boardSize - 1) { // if square is not in the far right column
        this.openCell(index - this.boardSize + 1); // square above and to the right
      }
    }

    if (coordinates.row < this.boardSize - 1) { // if square is not in the bottom row
      this.openCell(index + this.boardSize); // square below

      if (coordinates.column > 0) { // if square is not in the far left column
        this.openCell(index + this.boardSize - 1); // square below and to the left
      }

      if (coordinates.column < this.boardSize - 1) { // if square is not in the far right column
        this.openCell(index + this.boardSize + 1); // square below and to the right
      }
    }

    if (coordinates.column > 0) { // if square is not in the far left column
      this.openCell(index - 1); // square to the left
    }

    if (coordinates.column < this.boardSize - 1) { // if square is not in the far right column
      this.openCell(index + 1); // square to the right
    }
  }

  private openCell(index: number) {
    if (!this.cells[index].isOpen) {
      this.cells[index].isOpen = true;
      this.handleOpenedCell(index);
    }
  }
}
