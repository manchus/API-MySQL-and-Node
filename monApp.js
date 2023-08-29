const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();

const bodyParser = require("body-parser");
const Produit = require("./models/modProduit");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.set("views", "./views");
app.set("view engine", "ejs");

// middleware & static files
app.use("/public", express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Server activity
app.use(morgan("dev"));
// Adding MySql to the project
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ecole",
});


mongoose
  .connect("mongodb://localhost:27017/bd_prueba", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((db) => console.log("conexion exitosa"))
  .catch((err) => console.log("error: ", err));

// Test the connection MySQL

connection.connect((error) => {
  if (!!error) {
    console.log("Could not connect: " + error);
  } else {
    console.log("Connected successfully to the Database!");
  }
});

// SELECT text

app.get("/ecoledefi", (req, res) => {
  connection.query("SELECT * FROM etudiant", (error, rows, fields) => {
    if (!!error) {
      console.log(`Error in the query: ${error}`);
    } else {
      console.log("Query succeded!");
      //console.log(JSON.parse(JSON.stringify(rows)));
      let person = JSON.parse(JSON.stringify(rows));
      //res.send( person);
    }
  });
});

app.get("/select", (req, res) => {
  connection.query("SELECT * FROM etudiant", (error, rows, fields) => {
    if (!!error) {
      console.log(`Error in the query: ${error}`);
    } else {
      console.log("Query succeded!");
      let person = JSON.parse(JSON.stringify(rows));
      res.render("select", { pageTitle: "HOME", list: person });
    }
  });
});
//SELECT
app.get("/ecole", (req, res) => {
  connection.query("SELECT code FROM etudiant", (error, rows, fields) => {
    if (error) throw error;
    console.log("Query succeded!");
    let result = JSON.parse(JSON.stringify(rows));
    res.render("ecole", { codes: result });
    //res.render('ecole', {codes : rows});
  });
});

app.get("/ecoledbajaxRead", (req, res) => {
  let sql =
    'SELECT * FROM etudiant where code = "' + req.query.codeaffiche + '";';
  connection.query(sql, function (error, result, fields) {
    if (error) throw error;
    res.send({ infoclient: result });
  });
});

app.post("/ecoledbajaxWrite", (req, res) => {
  const up = req.body;
  var nom = up.nom;
  var nom = nom.trim();
  var prenom = up.prenom;
  var prenom = prenom.trim();
  var code = nom.substring(0, 3) + prenom.substring(0, 2);
  console.log(code);
  var photo = code + ".jpg";
  var sql =
    "INSERT INTO etudiant VALUES('" + code + "','" + nom + "'," +
        "'" + prenom + "','" + photo + "');";
  console.log(sql);

  /*Après avoir obtenu toutes les données, nous exécutons la requête d'insertion.*/
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.send({ products: result });
  });
});

app.post("/ecoledbajaxUpdate", (req, res) => {
  const up = req.body;
  // console.log(req)
  var code = up.code;
  var nom = up.nom;
  var prenom = up.prenom;
  console.log(code + " " + nom + " " + prenom);
  var sql = "UPDATE etudiant SET nom= '" + nom + "', prenom='" + prenom
          + "' WHERE code= '" + code + "';";
  console.log(sql);

  /*Après avoir obtenu toutes les données, nous exécutons la requête d'insertion.*/
  connection.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result);
    res.send({ products: result });
  });
});

// Aller vers le form. Avec Req du type GET
app.get("/form", (req, res) => {
  res.render("form");
});

// INSERT. Avec Teq du type POST
app.post("/form", (req, res) => {
  let newitem = req.body;
  let sql = "INSERT INTO tbTodolist SET ?";
  connection.query(sql, newitem, (error, result) => {
    if (!!error) {
      console.log(`Could not insert: ${error}`);
    } else {
      console.log(result);
      res.redirect("/select");
    }
  });
});

// DELETE
app.get("/delete", (req, res) => {
  let sql = "DELETE FROM tbTodolist WHERE id = ?";
  connection.query(sql, req.query.id, (error, result) => {
    if (!!error) {
      console.log("Could not delete");
    } else {
      res.redirect("/select");
    }
  });
});

//UPDATE
app.get("/update", (req, res) => {
  let sql = "UPDATE tbTodolist SET  status = 1  WHERE id = ?";
  connection.query(sql, req.query.id, (error, result) => {
    if (!!error) {
      console.log("Could not update");
    } else {
      res.redirect("/select");
    }
  });
});

app.get("/accueil/", (req, res) => {
  res.render("accueil.ejs", { userName: "n/a", pageTitle: "Accueil" });
});

app.get("/accueil/:nom", (req, res) => {
  const nom = req.params.nom;
  res.render("accueil", { userName: nom, pageTitle: "Accueil" });
});

app.get("/", (req, res) => {
  res.render("index.ejs");
});

let listeProduit = [
  { compagnie: "Cadbury", brand: "Kit Kat", price: 10.45 },
  { compagnie: "Hershey", brand: "Mars", price: 10.45 },
  { compagnie: "Laura Secord", brand: "Coffe Crisp", price: 10.45 },
  { compagnie: "General food", brand: "Wunderbar", price: 10.45 },
  { compagnie: "Canadian chocolate", brand: "Skittles", price: 10.45 },
];

app.get("/produit/", (req, res) => {
  res.render("produit", { prod: listeProduit, pageTitle: "Mes produits" });
});

app.get("/produit2", (req, res) => {
  res.json(listeProduit);
});

app.get("/produitChoix/:choix", (req, res) => {
  const choix = req.params;
  if (choix.choix.toLowerCase() == "chocolat") res.json(listeProduit);
  else if (choix.choix.toLowerCase() == "chips") res.json(listeProduit);
  else res.send("Mauvais choix ! nous ne vendons pas de " + choix.choix + " !");
});

app.listen(3000, () => {
  console.log("j'écoute le port 3000!");
});

// API with Mongo
app.post("/newProduit", (req, res) => {
  const produit2 = new Produit(req.body);
  produit2
    .save()
    .then((produit2) => {
      res.status(201).json(produit2);
    })
    .catch((e) => res.status(500).send({ message: e }));
});

app.get("/liste_produits", (req, res) => {
  Produit.find()
    .exec()
    .then((produit2) => res.status(201).json(produit2));
});

app.delete("/del_produit/:id", (req, res) => {
  const id = req.params.id;
  Produit.findByIdAndDelete(id)
    .then((produit) => {
      res
        .status(201)
        .json({ msg: `Le produit avec l'id ${produit._id} suprimée` });
    })
    .catch((e) => res.status(500).send({ message: e }));
});
