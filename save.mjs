import pg from "pg";
import express from "express";
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

const app = express()
app.use(bodyParser.json())
app.get("/users", (req, res) =>{
  client.query("select DISTINCT * from list order by id", (err, results) => {
    if(!err) {
      res.json(results.rows)
      console.log(results.rows)
    } else {
      console.log(err.message)
    }
  })
})

app.get("/users/:id", (req, res) => {
    const id = Number(req.params.id)
    client.query(`select DISTINCT * from list WHERE id = ${id}`, (err, results) => {
      if(!err) {
        res.json(results.rows[0])
        console.log(results.rows[0])
      } else {
        console.log(err.message)
      }
    })
  })
  
  app.patch('/user/:id', (req, res) => {
    const id = Number(req.params.id);

    const { firstname, lastname, email, ip } = req.body;
    //console.log(firstname, lastname, email, ip);
    client.query(`UPDATE list SET firstname = $1, lastname = $2, email = $3, ip = $4 WHERE id = $5`, [firstname, lastname, email, ip, id])
    .then(() => {
        res.send(`<h2>The user ${id} is updated</h2>`)
    })
})

// app.use(express.json())
// app.post("/users", (req, res) => {
//     const {id, firstName, lastName, email, ip } = req.body;
//   console.log(id, firstName, lastName, email, ip)

//     users.push({
//         id: id,
//         firstName: firstName,
//         lastName: lastName,
//         email: email,
//         ip: ip
//     });
//     res.send(users);
//   });

  // app.patch("/users/:id", (req, res) => {
  //   const userId = Number(req.params.id);
  //   const { firstname, lastname, email, ip} = req.body;
  //   console.log(firstname)
  //   client.query(`UPDATE list SET firstname = $1, lastname = $2, email = $3, ip = $4 WHERE id = $5`, [firstname, lastname, email, ip, userId], (err, results) => {
  //     if(!err) {
  //       res.send(`user${userId} modified`);
  //     } else {
  //       console.log(err.message)
  //     }
  //   })
  // }); 


  app.listen(3000, () =>{
    console.log("Server running on port 3000")
})