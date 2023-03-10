require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const { mergeSchemas } = require("@graphql-tools/merge");

const DATABASE_URL = process.env.DATABASE_URL;

const userSchema = require("./graphql/UserSchema").UserSchema;
const roomSchema = require("./graphql/RoomSchema").RoomSchema;
const bookingSchema = require("./graphql/BookingSchema").BookingSchema;

const mergedSchema = mergeSchemas({
  schemas: [userSchema, roomSchema, bookingSchema],
});

const cors = require("cors");
app.use(cors());
app.options("*", cors());

mongoose.set("debug", true);
mongoose.connect(
  DATABASE_URL, {useUnifiedTopology: true, useNewUrlParser: true},
  (err) => {
    if (err){
      console.error('Connection to DB failed');
    } else{
        console.log('Connection to DB was successful');
    }
  }
);

const db = mongoose.connection;
db.on('error', console.error.bind(console, "MongoDB connection failed"));

app.set("port", process.env.port || 4000);
app.listen(app.get("port"), () => {
  console.log("Node app is running at localhost:" + app.get("port"));
});

app.use(
  "/graphql",
  graphqlHTTP((req, _res, _graphQLParams) => {
    return {
      schema: mergedSchema,
      rootValue: global,
      graphiql: true,
      context: { req },
    };
  })
);

app.use((_req, res, _next) => {
    res.header("Access-Control-Allow-Origin", "*")
});

function logErrors(err, _req, _res, next) {
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }
}

function errorHandler(err, _req, res, _next) {
  res.status(500);
  res.render("error", { error: err });
}

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
