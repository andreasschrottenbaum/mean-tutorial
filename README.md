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

Because we need to import every module for its own, it can bloat up the AppModule pretty fast. Therefore we manage the imports for Angular Material in a separate module.

The --flat flag creates the module in the /src/app folder, instead of creating a subfolder for just one file.

```bsh
$ ng g m material –flat
```

`/src/app/material.module.ts`
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

Next, we need to import this module in our AppModule

`/src/app/app.module.ts`
```typescript
import { MaterialModule } from './material.module';

@NgModule({
  imports: [
    ...,
    MaterialModule
  ],
})
export class AppModule { }
```

## Set a loading message

As long as the main AppComponent is not loaded, we display the message ‚Loading Application‘ on the screen. Also, we add the Material Background globally to our output.

```html
<body class="mat-typography mat-app-background">
  <app-root>
    <div class="app-loader">
      Loading Application
    </div>
  </app-root>
</body>
```
