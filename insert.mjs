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

const app = express()
app.use(bodyParser.json());

const queryTable =  `CREATE TABLE IF NOT EXISTS list(
    id SERIAL,
    firstName VARCHAR not null,
    lastName VARCHAR not null,
    email VARCHAR not null,
    ip VARCHAR not null
  )`
  client.query(queryTable, (err, res) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Table created");
  });
  
  client
    .connect()
    .then(() =>
      users.forEach((user) => {
        let { firstName, lastName, email, ip } = user;
        client.query("insert into list (firstname, lastname, email, ip) values ($1, $2, $3, $4)", [
          firstName,
          lastName,
          email,
          ip,
        ])
      .then(() => client.query("select DISTINCT * from list order by id"))
      .then((results) => console.table(results.rows))
      .finally(() => client.end());
      })
    )
  
  app.listen(3000, () =>{
      console.log("Server running on port 3000")
  })