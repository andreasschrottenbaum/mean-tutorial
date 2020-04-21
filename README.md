# Create an Angular App with JWT Authorisation

## Getting started

### Prerequisites
- Install [node.js](https://nodejs.org)
- Get an [Editor](https://code.visualstudio.com)
- (optional) Install [MongoDB Server](https://mongodb.com)


If not done already, install `@angular/cli` globally:

```shell
$ npm i -g @angular/cli
```

Now we can access the `ng` command on the command line. We need it for seting up the project and adding components and other features to the project.

### Intialize the Project

```shell
$ ng new my-project
```
Answer the questions as follows:

- Would you like to add Angluar routing? YES
- Which stylesheet format would you like to use? SCSS

### Add Angular Material
We add Angular Material for an easier structuring and styling of our HTML markup.
```shell
$ ng add @angular/material
```
- Choose your preferred theme
- Set up global Angular Material typography styles? YES
- Set up browser animations for Angular Material? YES

### Add a module for Material

Because we need to import every module for its own, it can bloat up the `AppModule` pretty fast. Therefore we manage the imports for Angular Material in a separate module.

The --flat flag creates the module in the `/src/app/modules` folder, instead of creating a subfolder for just one file.

```shell
$ ng g m material –flat
```

We declare the first modules, that we need in the next step.

`/src/app/modules/material.module.ts`
```typescript
import { NgModule } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

@NgModule({
  exports: [
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule
  ]
})
export class MaterialModule { }
```

Next, we need to import this module in our `AppModule`

`/src/app/app.module.ts`
```typescript
import { MaterialModule } from './modules/material.module';

@NgModule({
  imports: [
    ...,
    MaterialModule
  ],
})
export class AppModule { }
```

## Set a loading message

As long as the main `AppComponent` is not loaded, we display the message ‚Loading Application‘ on the screen. Also, we add the Material Background globally to our output.

`/src/index.html`
```html
<body class="mat-typography mat-app-background">
  <app-root>
    <div class="app-loader">
      Loading Application
    </div>
  </app-root>
</body>
```

## Add global styling

The styles.scss is just a basic reset. Also we center the loading message on the screen:

`/src/styles.scss`
```scss
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Roboto, "Helvetica Neue", sans-serif;
}

.app-loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## Implement the basic layout

Our basic layout consists of a left sidebar, a topbar for the headline and the main content. The sidebar can be toggled on handheld devices. Also the sidebar should close on those devices on route change.

`/src/app/app.component.ts`
```typescript
import { Component, ViewChild } from '@angular/core';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router, Event, NavigationEnd } from '@angular/router';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('drawer') drawer;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) {
    // Close the navigation drawer on handsets after router change
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (window.matchMedia(Breakpoints.Handset).matches) {
          this.drawer.close();
        }
      }
    });
  }

  // copy/pasted from angular.io
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
```

## The main template

It‘s pretty straightforward. The `mat-sidenav` is either fixed or as pop-over, depending on the device witdh. We will replace the Navigation and the Headlines soon.

`/src/app/app.comonent.html`
```html
<mat-sidenav-container>
  <mat-sidenav
    #drawer
    fixedInViewport
    [mode]="(isHandset$ | async) ? 'over' : 'side'"
    [opened]="(isHandset$ | async) === false"
  >
    Navigation comes here
  </mat-sidenav>
  <mat-sidenav-content>
    <mat-toolbar color="primary">
      <button type="button" mat-icon-button (click)="drawer.toggle()" *ngIf="isHandset$ | async">
        <mat-icon>menu</mat-icon>
      </button>

      <div>
        <div>Headline</div>
        <div class="description">Description</div>
      </div>
    </mat-toolbar>

    <main>
      <router-outlet></router-outlet>
    </main>
  </mat-sidenav-content>
</mat-sidenav-container>
```

## The main app styling

Most of the styling and positioning is done from Angular Material. We just set the content to full width and height, and add some slight adjustments to the toolbar and the side navigation.

`/src/app/app.component.scss`
```scss
.mat-sidenav-container {
  min-width: 100vw;
  min-height: 100vh;
}

main {
  padding: 1em;

  display: flex;
  height: calc(100vh - 56px - 1em);
}

.mat-toolbar {
  position: sticky;
  top: 0;
  z-index: inherit;

  .description {
    font-weight: lighter;
    font-size: 70%;
  }
}

.mat-sidenav {
  width: 15em;
}
```

Now, the very basic structure of our app is finished. Wasn‘t that hard, don‘t you think?

## The Services

Before we add the services, we generate the `LoginComponent`, where most of them are used:

```shell
$ ng g c login
```

Let's add a quick and dirty route `/login` for the `LoginComponent`, just for development. We will get to a better way of handling routing in the next chapter.

`/src/app/app-routing.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

We use the `FormBuilder` for all forms in our project, so we need to add the `ReactiveFormsModule` to the `/src/app/app.module.ts`

`/src/app/app.module.ts`

```typescript
...
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  ...
  imports: [
    ...
    ReactiveFormsModule
  ],
  ...
})
export class AppModule { }
```

Now, we prepare a simple login form in the `LoginComponent` with just two required fields: `email` and `password`.

`/src/app/login/login.component.ts`

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required]]
    });
  }
}
```

In the next step, we use `<mat-form-field>`, we need to import it in the `MaterialModule`.

> Throughout this tutorial, we will need several modules. For keeping it simple, I will skip this step for every new module, so here is the final `MaterialModule`, we will have at the end:

`/src/app/modules/material.module.ts`

```typescript
import { NgModule } from '@angular/core';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  exports: [
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatSnackBarModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
    MatTableModule,
    MatDialogModule
  ]
})
export class MaterialModule { }
```

The markup is pretty straightforward. We will look into the features of the `FormBuilder` in a short while.

```html
<form [formGroup]="loginForm" class="loginForm">
  <p>
    <mat-form-field>
      <input matInput type="email" formControlName="email" placeholder="E-Mail">
    </mat-form-field>
  </p>
  <p>
    <mat-form-field>
      <input matInput type="password" formControlName="password" placeholder="Passwort">
    </mat-form-field>
  </p>

  <button mat-raised-button [disabled]="!loginForm.valid" color="primary">
    Login
  </button>
</form>
```

## The first service: `AuthService`

### Preparation

The `AuthService` is responsible for the user status. It contains all neccessary informations about the current user.

We generate it as used with the `ng` command and place the service in the `/src/app/shared/services` folder.

```shell
$ ng g s shared/services/auth
```

We also generate an `Interface` for the `User`

```shell
$ ng g i shared/interfaces/user
```

`/src/app/shared/interfaces/user.ts`

```typescript
export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  token: string;
}
```

Also, we will need another component, just for checking the login and have a redirect

```shell
$ ng g c dashboard
```

And the correlating route `/`

`/src/app/app-routing.module.ts`

```typescript
...
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  ...
  {
    path: '',
    component: DashboardComponent
  }
];
...
```

### The Service

Now, it's time to implement the service. For now, it has only two methods `login()` and `logout()`. We will expand it later.

```typescript
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User;
  private currentToken: string;
  status: 'idle' | 'processing' = 'idle';

  constructor(
    private router: Router,
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
      console.log('incorrect password');
      // TBD: Handle incorrect password
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
```

For further development, we need to implement the service in the `loginComponent`

`/src/app/login/login.component.ts`

```diff
+ import { AuthService } from '../shared/services/auth.service';

- private fb: FormBuilder
+ private fb: FormBuilder,
+ public auth: AuthService
```

To access it, we can use the `submit` call of our form. So, we need to update our template:

`/src/app/login/login.component.html`

```diff
- <form [formGroup]="loginForm" class="loginForm">
+ <form [formGroup]="loginForm" (submit)="auth.login(loginForm.value)" class="loginForm">
...
- <button mat-raised-button [disabled]="!loginForm.valid" color="primary">
-   Login
- </button>

+ <button mat-raised-button [disabled]="!loginForm.valid" color="primary">
+   <span *ngIf="auth.status==='processing'">
+     ...
+   </span>
+   Login
+ </button>
```

We also add the `AuthService` to the `DashboardComponent` to add a greeting and a logout button, if the user is logged in.

If no user is logged in, we show a link to the login page.

`/src/app/dashboard/dashboard.component.ts`

```diff
+ import { AuthService } from '../shared/services/auth.service';

- constructor() { }
+ constructor(
+   public auth: AuthService
+ ) { }
```

`/src/app/dashboard/dashboard.component.html`

```html
<div *ngIf="auth.user">
  <h3>Hello, {{ auth.user.name }}</h3>

  <button (click)="auth.logout()">Logout</button>
</div>

<a [routerLink]="['/login']" *ngIf="!auth.user">Login</a>
```

## Next Service: `NotificationService`

This service is responsible for displaying notifications at the bottom of the screen. It has just one `add()` method.

```shell
$ ng g s shared/services/notification
```

`/src/app/shared/services/notification.service.ts`

```typescript
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
```

### Implement the service

We can use the `NotificationService` to tell the user, if the credentials are incorrect:

`/src/app/login/login.component.ts`

```diff
+ import { NotificationService } from './notification.service';
...
- private router: Router
+ private router: Router,
+ private notification: NotificationService
...
- console.log('incorrect password');
- // TBD: Handle incorrect password
+ this.notification.add({
+   message: 'Incorrect username or password!',
+   status: 'warn'
+ });
```

## Next Up: The `HeadlineService`

This service sets the page title and the description in the template. As well as the `window.title`.

```shell
$ ng g s shared/services/headline
```

`/src/app/shared/services/headline.service.ts`

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HeadlineService {
  private currentTitle = '';
  private currentDescription = '';

  get title() {
    return this.currentTitle;
  }
  set title(title: string) {
    this.currentTitle = title;
    this.currentDescription = null;

    if (title) {
      document.title = `${title} | MEAN Auth Tutorial`;
    } else {
      document.title = 'MEAN Auth Tutorial';
    }
  }

  get description() {
    return this.currentDescription;
  }
  set description(description: string) {
    this.currentDescription = description;
  }
}
```

Next, we need to implement the service in the `AppComponent` and its template:

`/src/app/app.component.ts`

```diff
+ import { HeadlineService } from './shared/services/headline.service';

- private router: Router
+ private router: Router,
+ public headline: HeadlineService
```

`/src/app/app.component.html`

```diff
- <div>Headline</div>
+ <div>{{ headline.title }}</div>
- <div class="description">Description</div>
+ <div class="description">{{ headline.description }}</div>
```

For now, there is no output. We will come back to this feature later, when we implement the routing.

## The `ConfirmationService`

The `ConfirmationService` displays a dialog with two buttons. Per default it is `Cancel` and `OK`, but it can be individualized.

The service needs a component, so we create it first:

```shell
$ ng g c confirm-dialog
```

`/src/app/confirm-dialog/confirm-dialog.component.ts`

```typescript
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
```

`/src/app/confirm-dialog/confirm-dialog.component.html`

```html
<h3 mat-dialog-title *ngIf="headline">{{ headline }}</h3>

<mat-dialog-content>
  {{ message }}
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button mat-raised-button mat-dialog-close>{{ decline }}</button>
  <button mat-raised-button color="primary" (click)="close()">{{ accept }}</button>
</mat-dialog-actions>
```

And finally the service itself.

```shell
$ ng g s shared/services/confirm
```

It sends the informations for `message`, `headline`, `decline` and `accept`. The latest three are optional.

`/src/app/shared/services/confirm.service.ts`

```typescript
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
```

We don't use this service yet, but it is pretty handy and will be used throughout this course.

## The most important service: `ApiService`

This one is used for the communication with the backend. It has methods for `GET`, `POST`, `PUT` and `DELETE`.

Before we can communicate with the backend, we need to define the address:

`/src/environments/environment.ts`

```typescript
export const environment = {
  production: false,
  backendUrl: '//localhost:3000'
};
```

> ## The backend server is covered in antoher [tutorial](//TBD:insert_link). You can also just clone the [repository](//TBD:insert_link).

Also, we need to activate the `HttpClientModule`.

`/src/app/app.module.ts`

```diff
+ import { HttpClientModule } from '@angular/common/http';
...
- ReactiveFormsModule
+ ReactiveFormsModule,
+ HttpClientModule
```

```shell
$ ng g s shared/services/api
```

`/src/app/shared/services/api.service.ts`

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl: string;

  constructor(
    private http: HttpClient,
    private notification: NotificationService
  ) {
    this.baseUrl = environment.backendUrl;
  }

  get = (endpoint: string, data?) => {
    return this.http.get(`${this.baseUrl}${endpoint}`)
      .pipe(
        map(response => this.checkError(response, data?.allowedErrors)),
        catchError(this.handleError)
      );
  }

  post = (endpoint: string, data) => {
    return this.http.post(`${this.baseUrl}${endpoint}`, data)
      .pipe(
        map(response => this.checkError(response)),
        catchError(this.handleError)
      );
  }

  put = (endpoint: string, data) => {
    return this.http.put(`${this.baseUrl}${endpoint}`, data)
      .pipe(
        map(response => this.checkError(response)),
        catchError(this.handleError)
      );
  }

  delete = (endpoint: string) => {
    return this.http.delete(`${this.baseUrl}${endpoint}`)
      .pipe(
        map(response => this.checkError(response)),
        catchError(this.handleError)
      );
  }

  // The server always responds in JSON format.
  // If the response has a 'status' field, with the value 'error', we handle it here automatically.
  // We can whitelist errors to skip that step.
  private checkError = (response: any, allowedErrors?: [string]) => {
    if (response.status === 'error') {
      if (allowedErrors?.indexOf(response.message) >= 0) {
        return response;
      }

      this.notification.add({
        message: response.message,
        status: 'warn'
      });
    }

    return response;
  }

  // stolen from angular.io
  private handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);

      this.notification.add({
        message: JSON.stringify(error.error),
        status: 'warn'
      });
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
```