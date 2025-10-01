const express = require("express");
const fs = require("fs");
const textRef = "./txt/vanasonad.txt";
const dateET = require("./src/dateET");

// Loome rakenduse, mis käivitab express raamistiku
const app = express();

// määran lehtede renderdaja (view engine)
app.set("view engine", "ejs");

// muudame public kataloogi veebiserverile kättesaadavaks
app.use(express.static("public"));

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
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + ";", (err)=>{
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


							

app.listen(5314, () => {
    console.log("Server töötab: http://localhost:5314");
});

