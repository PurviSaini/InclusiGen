const express = require('express');
const app = express();
const mongoose=require("mongoose");
const bodyParser=require("body-parser");

//middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use("/public",express.static( __dirname + "/public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/views/main.html");
})
  
app.get("/analysis",function(req,res){
    res.sendFile(__dirname+"/views/analysis.html");
})


app.listen(80, function () {
    console.log('Your app is listening on port ' + 80)
});