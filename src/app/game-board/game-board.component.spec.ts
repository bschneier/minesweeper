import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GameBoardComponent } from './game-board.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('GameBoardComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameBoardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function openAllEmptyCellsExceptFirstOne() {
    // open all empty cells
    component.cells.map((value) => {
      if (!value.isMine) {
        value.isOpen = true;
      }
    });

    // find first cell and reset to closed
    component.cells[getFirstEmptyCellIndex()].isOpen = false;
  }

  function getFirstEmptyCellIndex(): number {
    let index = 0;
    while (true) {
      if (!component.cells[index].isMine) {
        return index;
      } else {
        index++;
      }
    }
  }

  describe('when user clicks new game button', () => {
    it('should randomly place mines', () => {
      const randomSpy = spyOn(Math, 'random').and.callThrough();
      component.newGame();
      // TODO: update to use dynamic board size and mines
      expect(randomSpy.calls.count()).toBeGreaterThanOrEqual(10);
      expect(component.mines.length).toBe(10);
    });

    it('should display the board', () => {
      expect(fixture.debugElement.query(By.css('#gameBoard'))).toBeNull();
      component.newGame();
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#gameBoard'))).toBeTruthy();
    });

    xit('board should be correct dimensions', () => {
      // TODO
    });
  });

  describe('when user opens cell', () => {
    beforeEach(() => {
      component.newGame();
    });

    it('updates cell state', () => {
      expect(component.cells[getFirstEmptyCellIndex()].isOpen).toBeFalsy();
      component.handleOpenedCell(getFirstEmptyCellIndex());
      expect(component.cells[getFirstEmptyCellIndex()].isOpen).toBeTruthy();
    });

    xdescribe('opens all neighboring cells when opened cell has zero neighboring mines', () => {
      // TODO
    });

    it('does not end game if there are remaining empty cells to be opened', () => {
      // TODO: prevent last square from being automatically opened
      // TODO: add test for detecting game over when last square is automatically opened
      for (let i = 0; i < component.cells.length - component.mines.length - 1; i++) {
        component.handleOpenedCell(getFirstEmptyCellIndex());
        expect(component.gameIsOver).toBeFalsy();
      }
    });
  });

  describe('remaining mines total is updated', () => {
    beforeEach(() => {
      component.newGame();
      expect(component.minesRemaining).toEqual(10);
    });

    it('when user flags a cell', () => {
      component.updateMinesRemaining(true);
      expect(component.minesRemaining).toEqual(9);
    });

    it('when user unflags a cell', () => {
      component.updateMinesRemaining(false);
      expect(component.minesRemaining).toEqual(11);
    });
  });

  describe('the game ends', () => {
    beforeEach(() => {
      component.newGame();
      expect(component.gameIsOver).toBeFalsy();
    });

    it('when user opens mine', () => {
      component.handleOpenedMine();
      expect(component.gameIsOver).toBeTruthy();
    });

    it('when user opens all empty cells', () => {
      openAllEmptyCellsExceptFirstOne();
      component.handleOpenedCell(getFirstEmptyCellIndex());
      expect(component.gameIsOver).toBeTruthy();
    });
  });
});
