const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
const mysql = require("mysql2");
const dateET = require("./src/dateET");
const dbinfo = require("../../vp2025config");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: false }));

const textRef = "./txt/vanasonad.txt";

// Andmebaasiühendus
const conn = mysql.createConnection({
  host: dbinfo.configData.host,
  user: dbinfo.configData.user,
  password: dbinfo.configData.passWord,
  database: dbinfo.configData.database,
});

// Avaleht
app.get("/", (req, res) => {
  res.render("index");
});

// Aeg ja kuupäev
app.get("/timeNow", (req, res) => {
  res.render("timeNow", {
    wd: dateET.weekDay(),
    date: dateET.longDate(),
  });
});

// Vanasõnad
app.get("/vanasonad", (req, res) => {
  fs.readFile(textRef, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Viga faili lugemisel");
    } else {
      res.render("genericlist", {
        h2: "Vanasõnad",
        ListData: data.split(";"),
      });
    }
  });
});

// Registreerimisvorm
app.get("/regvisit", (req, res) => {
  res.render("regvisit");
});

app.post("/regvisit", (req, res) => {
  console.log(req.body);

  // salvestame kasutaja nime tekstifaili, mitte ejs faili
  fs.appendFile("./txt/regvisit.txt", req.body.nameInput + ";\n", (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Viga salvestamisel!");
    } else {
      console.log("Salvestatud!");
      res.render("regvisit", { message: "Külaline salvestatud!" });
    }
  });
});

// Eesti film - avaleht
app.get("/eestifilm", (req, res) => {
  res.render("eestifilm");
});

// Filmiinimesed (andmebaasist)
app.get("/eestifilm/filmiinimesed", (req, res) => {
  const sql = "SELECT * FROM person";
  conn.execute(sql, (err, sqlRes) => {
    if (err) {
      console.error(err);
      res.render("filmiinimesed", { personList: [] });
    } else {
      res.render("filmiinimesed", { personList: sqlRes });
    }
  });
});

// Uue filmiinimese lisamine
app.get("/eestifilm/filmiinimesed_add", (req, res) => {
  res.render("filmiinimesed_add", { notice: "Sisesta midagi!" });
});

app.post("/eestifilm/filmiinimesed_add", (req, res) => {
  console.log(req.body);

  // Väärtuste kontroll
  if (
    !req.body.firstNameInput ||
    !req.body.lastNameInput ||
    !req.body.bornInput ||
    req.body.bornInput > new Date()
  ) {
    res.render("filmiinimesed_add", { notice: "Andmed on vigased!" });
    return;
  }

  let deceasedDate = null;
  if (req.body.deceasedInput && req.body.deceasedInput !== "") {
    deceasedDate = req.body.deceasedInput;
  }

  const sql =
    "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?, ?, ?, ?)";
  conn.execute(
    sql,
    [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate],
    (err) => {
      if (err) {
        console.error(err);
        res.render("filmiinimesed_add", { notice: "Viga andmete lisamisel!" });
      } else {
        res.render("filmiinimesed_add", { notice: "Andmed salvestatud!" });
      }
    }
  );
});

// Filmiinimeste positsioonid
app.get("/eestifilm/filmiinimeste_positsioon", (req, res) => {
  const sql = "SELECT * FROM position ORDER BY id DESC";
  conn.execute(sql, (err, result) => {
    if (err) {
      console.error(err);
      res.render("filmiinimeste_positsioon", { positionList: [] });
    } else {
      res.render("filmiinimeste_positsioon", { positionList: result });
    }
  });
});

// Positsiooni lisamine
app.get("/eestifilm/filmiinimeste_positsioon_add", (req, res) => {
  res.render("filmiinimeste_positsioon_add");
});

app.post("/eestifilm/filmiinimeste_positsioon_add", (req, res) => {
  const { position_name, description } = req.body;
  const sql = "INSERT INTO position (position_name, description) VALUES (?, ?)";
  conn.execute(sql, [position_name, description], (err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Viga positsiooni lisamisel!");
    } else {
      console.log("Uus positsioon lisatud:", position_name);
      res.redirect("/eestifilm/filmiinimeste_positsioon");
    }
  });
});

app.listen(5314, "0.0.0.0", () => {
  console.log("Server töötab: http://greeny.cs.tlu.ee:5314");
});
