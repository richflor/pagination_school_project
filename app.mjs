import express from "express";
import cors from "cors";
import mysql from 'mysql';
import dotenv from "dotenv";

dotenv.config();
const ENV = process.env;
const app = express();
const port = 8000;
const uriRoot = "/test";
const uriAPI = "/api";

const connection = mysql.createConnection({
  host     : 'unixshell.hetic.glassworks.tech',
  port     : '27116',
  user     : 'student',
  password : ENV.PASSWORD,
  database : 'sakila'
});

app.use(cors());

app.all(`${uriRoot}/*`, (req, res, next)=> {
    if(req.method !== "POST") {
        res.status(400).send("Wrong method used, only POST method is allowed");
    }
    next();
})

app.use(express.json())

app.post(uriRoot ,(req, res, next)=> {
    res.status(200).json(req.body);
    console.log(req.body);
})

app.get(uriAPI, (req, res)=> {
    connection.connect();
    // const connect = dbRequest(connection, 'SELECT * FROM actor LIMIT 3')
    // connect.then((query) => {
    //     req.body = query;
    //     res.status(200).json(req.body);
    //     console.log(req.body);
    // })
    // .catch((err) => {
    //     res.status(500).send(err);
    //     console.log(err);
    // })

    connection.query('SELECT * FROM actor LIMIT 3', function (error, results, fields) {
        if (error) {
            res.status(500).send(error);
            console.log(error);
        } else {
            req.body = results;
            res.status(200).json(req.body);
            console.log(req.body);
        }
      });
    connection.end();
})

app.listen(port, ()=> console.log(`API running on port:${port}`));