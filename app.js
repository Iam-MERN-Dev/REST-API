const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const request = require("request");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = {
    firstName: String,
    lastName: String,
    email: String,
    password: String
};

const User = mongoose.model("User", userSchema );

app.get("/", function(req, res){
        res.render("home");
});

app.get("/signup", function(req, res){
    res.sendFile(__dirname + "/signup.html");
});

app.get("/users", function(req, res) {
    User.find(function(err, foundUsers){
        if (!err){
            res.send(foundUsers);
        } else {
            res.send(err);
        }
    });
});

app.get("/login", function(req, res){
    res.sendFile(__dirname + "/login.html");
});



 app.post("/", function(req, res){
     
    const newUser = new User({
     firstName: req.body.fName,
     lastName : req.body.lName,
     email : req.body.email,
     password : req.body.password
    });
        newUser.save(function(err){
            if (!err){
                res.sendFile(__dirname + "/success.html");
            } else {
                res.send(err);
            }
        });
 
   
 });
app.post("/success", function(req, res){
    res.redirect("/");
});
 app.post("/login", function(req, res){
    
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email}, function(err, foundUser){
        if (err){
            console.log(err);
        } else {
            if (foundUser){
                if (foundUser.password === password) {
                    res.send(foundUser);
                }
            }
        }
    });
    
 });



const productSchema = {
    name: String,
    discryptio: String,
    quantity: Number,
    price: Number
};

const Product = mongoose.model("Product", productSchema);

app.get("/products", function(req, res){
    Product.find(function(err, foundProducts){
        if (!err){
            res.send(foundProducts);
        } else {
            res.send(err);
        }
    });
});

app.post("/products", function(req, res) {

    const newProduct = new Product({    
        name: req.body.name,
        discryption: req.body.discryption,
        quantity: req.body.quantity,
        price:  req.body.price
    });
    newProduct.save(function(err){
        if (err){
            res.send("Successfully Added product");

        } else {
            res.send(err);
        }
    })
});

app.listen(3000, function() {
    console.log("Server is working on port 3000");
});