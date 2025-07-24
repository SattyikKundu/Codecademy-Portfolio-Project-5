
import { Pool } from 'pg';   // Pool class from 'pg' (node-postgres) library used 
                             // to establish and manage PostgreSQL database connection

import dotenv from 'dotenv'; // loads .env variables into process.env 
                             // so they can be accessed anywhere in server code
dotenv.config();

// Created pool of database connections for PostgreSQL (later move this in an .env file, like in realworld App)
// NOTE: This below pool is commented out since this only works for the PostgreSQL on my localhost machine.
//       The next 'pool' is used in a *production* setting where web app on Render.com accesses the database
//       store in Neon.com.

/*
const pool = new Pool({
    user:     process.env.DB_USER,        // your postgre database's username
    host:     process.env.DB_HOST,        // since it works on my local computer
    database: process.env.DB_NAME,        // name of database
    password: process.env.DB_PASSWORD,    // password to access database
    port:     process.env.DB_PORT         // port where postgreSQL database is accessible 
});*/

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false  // Required for Neon on Render
  }
});

export default pool;