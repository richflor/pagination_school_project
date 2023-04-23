import express from "express";
import cors from "cors";
import mysql from 'mysql';
import dotenv from "dotenv";
import {QUERY} from "./req.mjs";

dotenv.config();
const ENV = process.env;
const app = express();
const port = 8000;
const uri = "/api";

const connection = mysql.createConnection({
  host     : 'unixshell.hetic.glassworks.tech',
  port     : '27116',
  user     : 'student',
  password : ENV.PASSWORD,
  database : 'sakila'
});

app.use(cors());

app.all(`${uri}/*`, (req, res, next)=> {
    if(req.method !== "GET") {
        res.status(400).send("Wrong method used, only GET method is allowed");
    }
    next();
})

// console.log(QUERY.BASE);

app.use(express.json());

app.get(uri, (req, res)=> {
    connection.connect();
    console.log(req.query);

    connection.query(QUERY.BASE(), function (error, results, fields) {
        if (error) {
            res.status(500).send("Internal Server Error");
            console.log(error);
        } else {
            req.body = results;
            res.status(200).json(req.body);
            // console.log(req.body);
        }
      });
    
    connection.end();
})

app.listen(port, ()=> console.log(`API running on port:${port}`));