import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface Notification {
  message: string;
  status?: 'success' | 'warn' | 'primary' | 'accent';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private snackBar: MatSnackBar
  ) { }

  add = (notification: Notification) => {
    this.snackBar.open(
      notification.message,
      '×',
      {
        duration: notification.duration || 4000,
        panelClass: ['mat-toolbar', `mat-${notification.status}`]
      }
    );
  }
}
