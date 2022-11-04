const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
// const multer = require("multer");
// const fs = require("fs");
// const path = require("path");
const { mergeSchemas } = require("@graphql-tools/merge");

const userSchema = require("./graphql/UserSchema").UserSchema;
const roomSchema = require("./graphql/RoomSchema").RoomSchema;
const bookingSchema = require("./graphql/BookingSchema").BookingSchema;

const mergedSchema = mergeSchemas({
  schemas: [userSchema, roomSchema, bookingSchema],
});

const cors = require("cors");

app.use(cors());
app.options("*", cors());

// TODO only for dev
mongoose.set("debug", true);

mongoose.connect(
  "mongodb://mongo/myappdb",
  { useUnifiedTopology: true },
  (err) => {
    if (err) throw err;
    console.log("connected to Auuuuuummmooooooo");
  }
);

app.set("port", process.env.port || 4000);
app.listen(app.get("port"), () => {
  console.log("Node app is running at localhost:" + app.get("port"));
});

// TODO:

// cleanup dummy img

app.use(
  "/graphql",
  graphqlHTTP((req, res, graphQLParams) => {
    return {
      schema: mergedSchema,
      rootValue: global,
      graphiql: true,
      context: { req },
    };
  })
);

app.get("/", (req, res) => {
  res.send("hello wood ! ");
});

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}

function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.status(500).send({ error: "Something failed!" });
  } else {
    next(err);
  }
}
function errorHandler(err, req, res, next) {
  res.status(500);
  res.render("error", { error: err });
}

app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);
