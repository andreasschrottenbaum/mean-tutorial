import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  constructor(
    private dialog: MatDialog
  ) { }

  ask(question, headline?, decline?, accept?) {
    return this.dialog.open(ConfirmDialogComponent, { data: { message: question, headline, decline, accept } });
  }
}
