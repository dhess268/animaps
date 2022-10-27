const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const connectDB = require("./config/db");
const passport = require("passport");
const cookieSession = require("cookie-session");
const session = require("express-session");
const mainRoutes = require("./routes/main");
const userRoutes = require("./routes/users");
const markerRoutes = require('./routes/markers')
var cors = require('cors')

const app = express();
const port = process.env.PORT || 8000;

connectDB();

app.use(cors())
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

app.use(bodyParser.json());
// app.use(passport.initialize());
// app.use(passport.session());
// main routes for login/logout
app.use("/", mainRoutes);
// test routes for adding testing data

app.use("/user", userRoutes);

app.use("/markers", markerRoutes)

if (process.env.NODE_ENV === "production") {
  // Express will serve up production assets
  // like our main.js file, or main.css file!
  app.use(express.static("client/build"));

  // Express will serve up the index.html file
  // if it doesn't recognize the route
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

module.exports = app.listen(port, () => {
  console.log(`Node.js listening on port 8000`);
});
