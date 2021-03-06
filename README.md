# COLPIX exercise 1

Author: Sergio Vaquero

## Contents

API REST backend with:
- Login
- Employees CRUD.

## Technology

It has been develop over Node 10.

It uses:
- `Claudia.js` to be deployed on `AWS lambdas`.
- `Babel` to transpile to ES5 for compatibility with `Claudia.js`.
- `claudia-api-builder` to manage HTTP requests.
- `claudia-local-api` to run on localhost.
- `Jasmine` for unit tests.
- `Knex` to connect with the database.
- `MySQL` for database.

## Database

Check folder `database` for MySQL scripts.

## Postman

Check folder `postman` for requests collection to run with Postman.

## NPM scripts

Check `package.js` for npm scripts:
- `test` Run unit tests.
- `server` Start a server on localhost.
- `create` Uses Claudia.js to create API Gateway and Lambda on AWS with OS user profile credentials. API Gateway and Lambda name is: `colpix-exercise-1`. It can be changed with additional argument `--name`.
- `update` Updates the previous created Claudia.js deploy on AWS.