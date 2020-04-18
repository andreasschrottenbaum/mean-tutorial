# Create an Angular App with JWT Authorisation

## Getting started

### Prerequisites
- Install [node.js](https://nodejs.org)
- Get an [Editor](https://code.visualstudio.com)
- (optional) Install [MongoDB Server](https://mongodb.com)


If not done already, install `@angular/cli` globally:

```bsh
$ npm i -g @angular/cli
```

Now we can access the `ng` command on the command line. We need it for seting up the project and adding components and other features to the project.

### Intialize the Project

```bsh
$ ng new my-project
```
Answer the questions as follows:

- Would you like to add Angluar routing? YES
- Which stylesheet format would you like to use? SCSS

### Add Angular Material
We add Angular Material for an easier structuring and styling of our HTML markup.
```bsh
$ ng add @angular/material
```
- Choose your preferred theme
- Set up global Angular Material typography styles? YES
- Set up browser animations for Angular Material? YES

### Add a module for Material

Because we need to import every module for its own, it can bloat up the `AppModule` pretty fast. Therefore we manage the imports for Angular Material in a separate module.

The --flat flag creates the module in the `/src/app/modules` folder, instead of creating a subfolder for just one file.

```bsh
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

```bsh
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

The `AuthService` is responsible for the user status. It contains all neccessary informations about the current user.

We generate it as used with the `ng` command and place the service in the `/src/app/shared/services` folder.

```bsh
$ ng g s shared/services/auth
```

