//const { Pool } = require('pg'); // Pool class from 'pg' (node-postgres) library used 
                                // to establish and manage PostgreSQL database connection

import { Pool } from 'pg';                                

// Create pool of database connections for PostgreSQL (later move this in an .env file, like in realworld App)
export const pool = new Pool({
    user:     'postgres',                       // your postgre database's username
    host:     'localhost',                      // since it works on my local computer
    database: 'PERN-Ecommerce-app-database',    // name of database
    password: 'Lajabab123',                     // password to access database
    port:      5432                             // port where postgreSQL database is accessible 
});


//module.exports = pool; // Export 'pool' object (which is the pg.Pool object that contains 
                       // all database conenction logic) to be used elsewhere
