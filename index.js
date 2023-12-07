const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const session = require("express-session");
const { error, log } = require("console");
const { request } = require("http");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "BusBookingSystem",
  port: "3306",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected!!");
});

app.set("views", __dirname + "/views");
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000 },
  })
);
app.set("view engine", "hbs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/profile", (req, res) => {
  res.render("profile");
});

app.get("/search", (req, res) => {
  try {
    var query = `select * from location`;
    //console.log(req.body);
    connection.query(query, function (err, results) {
      if (err) {
        res.status(404).json(err);
      }
      if (results.length > 0) {
        res.render("search", { locations: results });
        console.log(results);
      }
    });
  } catch (error) {}
});


app.post("/search", (req, res) => {
  try {
    var query = "select * from bus where from_adrs = ? and to_adrs = ?";
    console.log(req.body);
    connection.query(
      query,
      [req.body.fadrs, req.body.tadrs],
      function (err, buslist) {
        if (err) {
          res.status(404).json(err);
        }
        if (buslist.length > 0) {
          var query = `select * from location`;
          //console.log(req.body);
          connection.query(query, function (err, results) {
            if (err) {
              res.status(404).json(err);
            }
            if (results.length > 0) {
              res.render("search", { locations: results, buses: buslist });
              console.log(results);
            }
          });
          //   res.render("search", { locations: results });
          //   console.log(results);
        }
      }
    );
  } catch (error) {}
});

app.post("/login", (req, res) => {
  console.log("Inside login action");
  try {
    var query = `select * from login where username=? and password=?`;
    //console.log(req.body);
    connection.query(
      query,
      [req.body.username, req.body.password],
      function (err, results) {
        if (err) {
          res.status(404).json(err);
        }
        if (results.length > 0) {
          req.session.userid = results.login_id;
          res.redirect("/home");
          console.log(results);
        }
      }
    );
  } catch (error) {}

  res.render("index");
});

app.get("/CreateAccount", (req, res) => {
  res.render("CreateAccountPage");
});

app.listen(3000, () => {
  console.log("server started");
});
