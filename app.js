const express = require("express");
const app = express();
const PORT = 7632;
const pg = require("pg");
const env = require('dotenv').config().parsed;
const path = require('path');
const cors = require("cors");
const naspodata=[];
// console.log(env);
// console.log(process.env);
app.use(express.json());
app.use(cors({origin:"*"}));
const connectionString =
  "postgres://naspo:" +
  "mSGr4CLGQnmw3fKhBWgnWd6w" +
  "@naspo-data-warehouse.cecnoxkqhzpt.us-east-2.rds.amazonaws.com:5432/naspo";
const pgClient = new pg.Client(connectionString);
pgClient.connect();

try {
  pgClient.query(
    `SELECT "Full Name","Region" FROM warehouse.pbi_registrations_all_events where "EventID" = 'A671ABEA-476E-4623-BC94-5DF7043A582A' and "Status" = 'Accepted'`,
    (err, res) => {
      if (err) {
        console.log(err);
      } else {
        // console.log(res);
        console.log("++++++++++++++++++++++++++++");
        // console.log(res.rowCount);
        // console.log(res.rows);
        res.rows.forEach(row=>{
            console.log(row);
            naspodata.push(row);
        })
      }
      pgClient.end();
    }
  );
} catch (e) {
  console.log(e);
}

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/get",(req,res)=>{
res.json({"naspodata":naspodata});
})

app.listen(PORT, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
