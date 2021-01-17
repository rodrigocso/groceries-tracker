import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './discount-dialog.component.html',
  styleUrls: ['./discount-dialog.component.scss']
})
export class DiscountDialogComponent {
  discountCtrl = new FormControl();

  constructor(private dialogRef: MatDialogRef<DiscountDialogComponent>) { }

  confirm(): void {
    this.dialogRef.close(this.discountCtrl.value);
  }
}