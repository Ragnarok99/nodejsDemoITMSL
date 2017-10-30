const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

let db;

MongoClient.connect(
  "mongodb://emma:123@ds239965.mlab.com:39965/demoitm",
  (err, database) => {
    if (err) return console.log(err);
    db = database;
    app.listen(3000, () => {
      console.log("listening on 3000");
    });
  }
);

const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true })); // middleware for extract request data form
app.use(bodyParser.raw());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  
  next();
});


app.get("/api/tasks", (req, res) => {
  var cursor = db
    .collection("tasks") 
    .find()
    .sort({ createdAt: -1 })
    .toArray((err, results) => {
      res.send(results);
    });
});

app.post("/api/new_task", (req, res) => {
  const body = req.body;
  console.log(body);

  if (typeof body !== "object" || Object.keys(body).length === 0) {
    return res
      .status(400)
      .send({
        message: "You must provide valid JSON and with least one property"
      });
  }
  db.collection("tasks").insert(body, (err, result) => {
    if (err) return res.send({ message: err });
    console.log(result)
    res.status(201).send(result.ops);
  });
});

app.delete("/api/remove_task", (req, res) => {
  const id = req.body.id;
  try {
    db.collection("tasks").remove({ _id: ObjectId(id) }, (err, result) => {
      if (result.result.n === 0) {
        return res.status(404).send({});
      }
      res.send(result);
    });
  } catch (errr) {
    res.status(400).send({ message: "Invalid data, " + errr });
  }
});

app.put("/api/update_task", (req, res) => {
  const id = req.body._id;
  const item = req.body;
  delete item._id;

  try {
    db
      .collection("tasks")
      .findOneAndUpdate(
        { _id: ObjectId(id) },
        { $set: item },
        (err, result) => {
          if (err) return res.send(err);
          res.send(result);
        }
      );
  } catch (errr) {
    res.status(400).send({ message: "something went wrong, " + errr });
  }
});
