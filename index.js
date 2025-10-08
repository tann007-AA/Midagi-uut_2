const express = require("express");
const fs = require("fs");
const bodyparser = require("body-parser");
const textRef = "./txt/vanasonad.txt";
//lisan andmebaasiga suhtlemise paketi
const mysql = require("mysql2");
const dateET = require("./src/dateET");
//lisan andmebaasi juurdepaasu info
const dbinfo = require("../../vp2025config");
// Loome rakenduse, mis käivitab express raamistiku
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: false}));

//loome andmebaasiuhenduse
const conn = mysql.createConnection({
	host: dbinfo.configData.host,
	user: dbinfo.configData.user,
	password: dbinfo.configData.passWord,
	database: dbinfo.configData.database
});

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/timeNow", (req, res) => {
    res.render("timeNow", {
        wd: dateET.weekDay(),
        date: dateET.longDate()
    });
});

app.get("/vanasonad", (req, res) => {
    fs.readFile(textRef, "utf8", (err, data) => {
        if (err) {
            res.status(500).send("Viga faili lugemisel");
        } else {
            res.render("genericlist", {
                h2: "Vanasonad",
                ListData: data.split(";")
            });
        }
    });
});

app.get("/regvisit", (req, res) => {
    res.render("regvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("./views/regvisit.ejs", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("./views/regvisit.ejs", req.body.nameInput + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("regvisit");
				}
			});
		}
    });
});

app.get("/eestifilm", (req, res) => {
    res.render("eestifilm");
});

app.get("/eestifilm/filmiinimesed", (req, res) => {
	const sqlReq = "SELECT * FROM person";
	//conn.query
	conn.execute(sqlReq, (err, sqlRes)=>{
		if(err){
			console.log(err);
			res.render("filmiinimesed", {personList: []});
		}
		else {
			console.log(sqlRes);
			res.render("filmiinimesed", {personList: sqlRes});
		}
	})
    //res.render("filmiinimesed");
});

app.get("/eestifilm/filmiinimesed_add", (req, res) => {
    res.render("filmiinimesed_add", {notice: "Sisesta midagi!" });
});

app.post("/eestifilm/filmiinimesed_add", (req, res) => {
	console.log(req.body)
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || 
	req.body.bornInput > new Date ()){
		res.render("filmiinimesed_add", {notice: "Andmed on vigased!"});
	}
	else{
		let deceasedDate = null;
		if(req.body.deceasedInput != ""){
			deceasedDate = req.body.deceasedInput;
		}
		let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased)VALUES (?,?,?,?)";
        conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedInput], 
		(err, sqlRes)=>{
			if(err){
				console.log(err);
				res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga: "+ err});
			}
		});		
	}
    //res.render("filmiinimesed_add");
});

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


