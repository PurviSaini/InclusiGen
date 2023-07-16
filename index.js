const express = require('express');
const app = express();
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const Employee = require("./models/employee.js");

// npm install express express-openid-connect --save
// npm i express-openid-connect dotenv

//create instance for auth0
const { auth } = require('express-openid-connect');
require('dotenv').config()

//configure auth0
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUERBASEURL
  };

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use("/public",express.static( __dirname + "/public"));

//// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

//connecting mongodb
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("mongodb connected");

app.get("/",function(req,res){
    res.sendFile(__dirname+"/views/main.html");
})
  
app.get("/analysis",function(req,res){
    res.sendFile(__dirname+"/views/analysis.html");
});

app.listen(80, function () {
    console.log('Your app is listening on port ' + 80)
});