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
const hour = 36*Math.pow(10, 5)

app.use(cors());

app.all(`${uri}/*`, (req, res, next)=> {
    if(req.method !== "GET") {
        res.status(400).send("Wrong method used, only GET method is allowed");
    }
    next();
})

// console.log(QUERY.BASE)n;

app.use(express.json());
app.use(express.static('public'))

app.get('/', (req, res, next)=> {
    res.sendFile("../public/index.html");
})

app.get(`${uri}*`, (req, res)=> {
    console.log(req.query);

    const connection = mysql.createConnection({
        host     : 'unixshell.hetic.glassworks.tech',
        port     : '27116',
        user     : 'student',
        password : ENV.PASSWORD,
        database : 'sakila'
    });

    if(req.query.nbr_lines) {
        connection.query(QUERY.NBR_LINES, function (error, results, fields) {
            if (error) {
                res.status(500).send("Internal Server Error");
                console.log(error); 
                console.log("bang1")
                throw error;
            } else {
                req.body = results;
                res.status(200).json(req.body);
            }
        });
        return;
    }

    if(!QUERY.checkParams(req.query)) {
        console.log("error 1")
        res.status(404).send("Invalid parameters, only those are allowed : type, limit, page, order");
        return
    }
    
    if(!QUERY.checkValues(req.query)) {
        console.log("error 2")
        res.status(404).send("Invalid parameter values");
        return
    }

    connection.query(QUERY.BASE(req.query), function (error, results, fields) {
        if (error) {
            res.status(500).send("Internal Server Error");
            console.log(error);
            console.log("bang2")
            throw error
        } else {
            req.body = results;
            res.status(200).json(req.body);
            connection.end();
        }
    });
    
})



app.listen(port, ()=> console.log(`API running on port:${port}`));