# Northcoders News API

## URL to API

https://nc-news-ts.onrender.com/api

## Summary

The NC News API provides access to a comprehensive news platform where users can retrieve articles, topics, comments, and user information. It supports various endpoints for fetching, creating, updating, and deleting data.

More detailed information on each endpoint can be found at:
https://be-project-nc-news.onrender.com/api

## Getting Started

### Prerequisites
Node.js: Minimum version 14.0.0  
PostgreSQL: Minimum version 12.0  

### Cloning the Repository

`git clone https://github.com/ZviHaffner/be-project-nc-news.git`

### Installing Dependencies

Ensure you have Node.js and npm installed, then run:  
`npm install`

### Seeding the Local Database

To set up and seed the local database, run:  
`npm run setup-dbs`  
`npm run seed`

### Running Tests

To run the test suite, run:  
`npm test`

## Setup of Environment Variables

`.env.*` files have been set to be ignored by Git. Therefore, new `.env` files will have to be created to set up the environment variables required for the project to run.  

Here are the steps to create and configure these files:

1. Create a `.env.test` file in the root directory of the project with the following content:

  PGDATABASE=<database_name>_test,

2. Create a `.env.development` file in the root directory of the project with the following content:

  PGDATABASE=<database_name>,

--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
