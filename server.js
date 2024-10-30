const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mysql = require("mysql2");
const cors = require("cors");


app.use(express.json());
app.use(cors());
dotenv.config();

//Connecting to the Database 
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
});

//testing the connection
db.connect((err) => {
    //connection is not successful
    if(err){
        return console.log("Error connecting to the Database: ", err);
    }

    //connection is successful
    console.log("Successfully connected to MySQL: ", db.threadId);
});

//1. reterieve all patients
app.get('/patients', (req,res) => {
    const getPatients ="SELECT patient_id, first_name, last_name, date_of_birth FROM patients";
    db.query(getPatients, (err, data) => {
        if(err){
            return res.status(500).send("Error retrieving patients", err);
        }
        res.status(200).send(data);
    });
});

// 2. retrieve all providers
app.get('/providers', (req, res) => {
    const getProviders = ("SELECT first_name, last_name, provider_specialty FROM providers");
    db.query(getProviders, (err, results) => {
        if(err){
            return res.status(500).send("Error retrieving providers", err);
        }
        res.status(200).send(results);
    });
});

// 3. Filter patients by first name
app.get('/patients/firstname', (req, res) => {
    const getFirstName = ("SELECT first_name FROM patients");
    db.query(getFirstName, (err, results) => {
        if(err){
            return res.status(500).send("Error retrieving patients' first name", err);
        }
        res.status(200).send(results);
    });
});

// 4. Retrieving all providers by their specialty
app.get("/providers/specialty", (req, res) => {
    const query = "SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty IS NOT NULL";
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).send("Error retrieving providers by specialty");
      }
      res.status(200).send(results);
    });
});
// listening to the port
const PORT = 3300;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
});