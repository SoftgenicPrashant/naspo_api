const express = require("express");
const app = express();
const PORT = 7632;
const pg = require('pg');
const env = require('dotenv').config().parsed;
const path = require('path');
// console.log(env);
// console.log(process.env);
// const connectionString =
//   "postgres://naspo:"+process.env.PGPASSWORD +
//   "@naspo-data-warehouse.cecnoxkqhzpt.us-east-2.rds.amazonaws.com:5432/naspo";
// const pgClient = new pg.Client(connectionString);
// const db = pgClient.connect();
async function getdata(){
    const naspodata=[];
    const naspo = await pgClient.query(
        `SELECT "Full Name","Region" FROM warehouse.pbi_registrations_all_events where "EventID" = 'A671ABEA-476E-4623-BC94-5DF7043A582A' and "Status" = 'Accepted'`
      );
        naspo.rows.forEach(row=>{
            // console.log(row);
            naspodata.push(row);
        });
        return naspodata;
}      
let pool;
try{
    pool = new pg.Pool({
        user: 'naspo',
        host: 'naspo-data-warehouse.cecnoxkqhzpt.us-east-2.rds.amazonaws.com',
        database: 'naspo',
        password: process.env.PGPASSWORD,
        port: 5432,
      });
      console.log(pool);
}catch(e){
    console.log(e);
}
console.log(pool);

app.use(express.static("public"));


app.get("/naspo",async (request,response)=>{
    try {
        console.log(request.url);
        const data = await pool.query(`SELECT "Full Name","Region" FROM warehouse.pbi_registrations_all_events where "EventID" = 'A671ABEA-476E-4623-BC94-5DF7043A582A' and "Status" = 'Accepted'`);
        response.status(200).json(data.rows);
        await pool.end();
    } catch (error) {
        return next(error);
    }

});


app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname + "/index.html"));
});



app.listen(process.env.PORT || PORT, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});

// db.then((resolvedata)=>{
//   return resolvedata.json();
// }).then(data=>{
//     console.log(data);
// }).catch(e=>{
//     console.log(e);
// })
// try {
//     pgClient.query(
//       `SELECT "Full Name","Region" FROM warehouse.pbi_registrations_all_events where "EventID" = 'A671ABEA-476E-4623-BC94-5DF7043A582A' and "Status" = 'Accepted'`,
//       (err, res) => {
//         if (err) {
//           console.log(err);
//           response.send(err);
//         } else {
//           // console.log(res);
//           console.log("++++++++++++++++++++++++++++");
//           // console.log(res.rowCount);
//           // console.log(res.rows);
//           res.rows.forEach(row=>{
//               // console.log(row);
//               naspodata.push(row);
//           });
//           response.json({"naspodata":naspodata});
//         }
//         // pgClient.end();
//       }
//     );
//   } catch (e) {
//     console.log(e);
//     response.send(err);
//   }