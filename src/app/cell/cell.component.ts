import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CellComponent {
  @Input() isMine: boolean;
  @Input() minesTouching: number;
  @Input() isOpen = false;
  @Input() isFlagged = false;
  @Input() showMine = false;
  @Input() isActive = true;
  @Input() isFirstColumn = false;
  @Input() isLastRow = false;
  @Output() openedCell = new EventEmitter();
  @Output() openedMine = new EventEmitter();
  @Output() flaggedCell = new EventEmitter();
  clickedMine = false;

  constructor() { }

  handleClick() {
    if (this.isActive && !this.isFlagged) {
      if (this.isMine) {
        this.clickedMine = true;
        this.openedMine.emit();
      } else if (!this.isOpen) {
        this.isOpen = true;
        this.openedCell.emit();
      }
    }
  }

  handleRightClick() {
    if (!this.isOpen && this.isActive) {
      this.isFlagged = !this.isFlagged;
      this.flaggedCell.emit(this.isFlagged);
    }
    return false;
  }
}
