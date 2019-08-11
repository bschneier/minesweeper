import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CellComponent } from './cell.component';

describe('CellComponent', () => {
  let component: CellComponent;
  let fixture: ComponentFixture<CellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellComponent);
    component = fixture.componentInstance;
    component.isOpen = false;
    fixture.detectChanges();
  });

  describe('when user clicks on unopened cell', () => {
    describe('and cell is a mine', () => {
      beforeEach(() => {
        component.isMine = true;
      });

      it('should show the exploded mine', () => {
        component.handleClick();
        expect(component.clickedMine).toBeTruthy();
      });

      it('should emit an opened mine event', () => {
        const spy = spyOn(component.openedMine, 'emit');
        component.handleClick();
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('and cell is not a mine', () => {
      beforeEach(() => {
        component.isMine = false;
      });

      it('should open the cell', () => {
        component.handleClick();
        expect(component.isOpen).toBeTruthy();
      });

      it('should emit an opened event', () => {
        const spy = spyOn(component.openedCell, 'emit');
        component.handleClick();
        expect(spy).toHaveBeenCalled();
      });
    });
  });

  describe('when cell is already opened', () => {
    beforeEach(() => {
      component.isOpen = true;
    });

    it('and user clicks, no action is taken', () => {
      const openedCellSpy = spyOn(component.openedCell, 'emit');
      const openedMineSpy = spyOn(component.openedMine, 'emit');
      component.handleClick();
      expect(openedCellSpy).not.toHaveBeenCalled();
      expect(openedMineSpy).not.toHaveBeenCalled();
    });

    it('and user right clicks, no action is taken', () => {
      const spy = spyOn(component.flaggedCell, 'emit');
      component.handleRightClick();
      expect(spy).not.toHaveBeenCalled();
      expect(component.isFlagged).toBeFalsy();
    });
  });

  it('when user clicks on a flagged cell no action is taken', () => {
    const openedCellSpy = spyOn(component.openedCell, 'emit');
    const openedMineSpy = spyOn(component.openedMine, 'emit');
    component.isFlagged = true;
    component.handleClick();
    expect(openedCellSpy).not.toHaveBeenCalled();
    expect(openedMineSpy).not.toHaveBeenCalled();
  });

  describe('when game is over', () => {
    beforeEach(() => {
      component.isActive = false;
    });

    it('and user clicks on a cell, no action is taken', () => {
      const openedCellSpy = spyOn(component.openedCell, 'emit');
      const openedMineSpy = spyOn(component.openedMine, 'emit');
      component.handleClick();
      expect(openedCellSpy).not.toHaveBeenCalled();
      expect(openedMineSpy).not.toHaveBeenCalled();
    });

    it('and user right clicks on a cell, no action is taken', () => {
      const spy = spyOn(component.flaggedCell, 'emit');
      component.handleRightClick();
      expect(spy).not.toHaveBeenCalled();
    });
  });


  describe('when user right clicks on cell', () => {
    it('should display and hide flag', () => {
      component.handleRightClick();
      expect(component.isFlagged).toBeTruthy();

      component.handleRightClick();
      expect(component.isFlagged).toBeFalsy();
    });

    it('should emit a flagged event', () => {
      const spy = spyOn(component.flaggedCell, 'emit');
      component.handleRightClick();
      expect(spy).toHaveBeenCalledWith(true);

      component.handleRightClick();
      expect(spy).toHaveBeenCalledWith(false);
    });
  });
});
