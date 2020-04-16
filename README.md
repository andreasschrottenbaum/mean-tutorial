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