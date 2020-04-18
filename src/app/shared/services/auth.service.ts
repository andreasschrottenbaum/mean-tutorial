import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../interfaces/user';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User;
  private currentToken: string;
  status: 'idle' | 'processing' = 'idle';

  constructor(
    private router: Router,
    private notification: NotificationService
  ) {
    // We store the user information in the local storage
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.currentToken = localStorage.getItem('access_token');
  }

  get user() { return this.currentUser; }
  get token() { return this.currentToken; }

  login(data: { email: string, password: string }) {
    this.status = 'processing';

    if (data.email === 'example@example.com' && data.password === 'correct horse battery staple') {
      this.status = 'idle';

      this.currentUser = {
        _id: null,
        email: data.email,
        name: 'SuperUser',
        password: data.password,
        role: 'admin',
        token: 'SuperSecretToken'
      };

      this.currentToken = 'SuperSecretToken';

      localStorage.setItem('user', JSON.stringify(this.user));
      localStorage.setItem('access_token', this.token);

      this.router.navigate(['/']);
    } else {
      this.status = 'idle';
      this.notification.add({
        message: 'Incorrect username or password!',
        status: 'warn'
      });
    }
  }

  logout() {
    this.currentUser = null;
    this.currentToken = null;

    localStorage.removeItem('user');
    localStorage.removeItem('access_token');

    this.router.navigate(['/login']);
  }
}
