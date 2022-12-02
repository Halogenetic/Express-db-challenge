import pg from "pg";
import express from "express";
import { users } from './users.mjs'
import bodyParser from "body-parser";
import * as dotenv from 'dotenv'
dotenv.config()

const client = new pg.Client({
  user: 'expressdb_admin',
  host: 'localhost',
  database:"expressdb",
  password: `${process.env.MYSQL_PASSWORD}`,
  port: 5432,
})

client.connect();

const sqlTable = `CREATE TABLE IF NOT EXISTS list (
    id SERIAL, 
    firstName VARCHAR(50) NOT NULL, 
    lastName VARCHAR(50) NOT NULL, 
    email VARCHAR(50) NOT NULL, 
    ip VARCHAR(50) NOT NULL,
    PRIMARY KEY(id)
    )`

client
    .query(sqlTable)
    .catch((e) => console.error(e.stack))
    //.then(() => client.end()) !!!!! never 
    .then(() => {
        for (let user of users) { //list (id - dont need, because serial, he will fill in himself), user.id - from list.mjs
            client.query((`INSERT INTO
                list (firstName, lastName, email, ip) 
                VALUES ($1, $2, $3, $4)`), [user.firstName, user.lastName, user.email, user.ip]
            )
        }
    })
    .then(client.query('SELECT * FROM list'))
    .then(() => client.query ("select DISTINCT * from list ORDER BY ID"))
    .then((results)=> console.table(results.rows))
    .catch((e) => console.error(e.stack))
    .finally(() => client.end())