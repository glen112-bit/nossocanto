//**
import dotenv from 'dotenv';
dotenv.config();
 
const express = require('express');
const mysql = require('mysql');

const DB = mysql.createConnection({
  host: 'localhost',
  user:'root',
  password: '',
  database: 'nossocantosp'
});
DB.connect((err) => {
// {  err ? throw err : console.log('coneccion exitosa')
// }   
  if (err){
    console.log('error de conexion')
  }
    return
})

const PORT = parseInt(`${process.env.PORT || 3000}`);
 
import app from './app';
 
app.listen(PORT, () => console.log(`Server is running at ${PORT}.`));
//*/
/*


  
const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
    origin: "http://localhost:8081"
    
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
 app.use(express.json());

// // parse requests of content-type - application/x-www-form-urlencoded
 app.use(express.urlencoded({ extended: true  }));

// // simple route
 app.get("/", (req, res) => {
   res.json({ message: "Welcome to bezkoder application."  });
   });

//   // set port, listen for requests
   const PORT = process.env.PORT || 8080;
   app.listen(PORT, () => {
     console.log(`Server is running on port ${PORT}.`);
     });
     */
