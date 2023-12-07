const express = require("express");
const cors = require('cors');
const { Pool } = require('pg'); 
require('dotenv').config();

const db_router = require('./routes/db_router');

const app = express();
const PORT = process.env.PORT || 8080;
const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: process.env.PSQL_PORT,
    ssl: { rejectUnauthorized: false },
});
app.set('pool', pool);

// Add this code to check the database connection
pool.connect((err, client, release) => {
    if (err) {
      console.error('Error connecting to the database:', err);
    } else {
      console.log('Connected to the database');
      release(); // Release the client back to the pool
    }
});

// Middleware setup
app.use(cors());
app.use('/db', db_router);

app.use(
    cors({
      origin: 'http://localhost:5173', //will eventually be frontend url
      methods: 'GET,POST',
    })
);

// Error handling 
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

// Start the server
app.listen(PORT, () => {
  console.log("Server Started");
});
