import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  headline: string;
  message: string;
  decline = 'Cancel';
  accept = 'OK';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {
    this.headline = data.headline;
    this.message = data.message;

    if (data.decline) {
      this.decline = data.decline;
    }

    if (data.accept) {
      this.accept = data.accept;
    }
  }

  close() {
    this.dialogRef.close({
      status: 'confirmed'
    });
  }
}
