# Angular4 Restaurant

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.1.0.

The application is running at http://donhenton-node.herokuapp.com/restaurantAngular4.doc

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Working with Typings
* typings install with typings.json to keep code editor happy
* the typings area of tsconfig.app.json should be left empty
* npm install @types/postal --save-dev to keep ng build happy

## Gotchas
* Services cannot be exported as default see https://github.com/angular/angular-cli/issues/3834
reply by amiram
* to remove interface warnings on rebuild of dev: https://github.com/angular/angular-cli/issues/2034 see strake7 comment, change module to commonjs in tsconfig.app.json from es2015
* when running ng build --prod, the html components cannot have access to private variables, so 
if a inline html template talks to a private variable, you will need to make it non private for
working with Angular4: https://github.com/angular/angular-cli/issues/5621
* also inline calls in html must match signatures of your functions, so no function(x) and calling as function()

