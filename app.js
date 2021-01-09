const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
require('dotenv').config()
const app = express();


app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
    
    const userSearch = req.body.city;
    const apiKey = process.env.API_KEY;
    const url = "https://api.openweathermap.org/data/2.5/weather?appid=" + apiKey + "&q=" +userSearch+ "&units=metric";

    
    https.get(url, function(response){
        // console.log(response.statusCode);
        response.on("data", function(data){
  
    //parsing data
        const weatherData = JSON.parse(data);
    // console.log("response.status:" , weatherData.cod);
        if (weatherData.cod === 200){
           
        const temp = Math.round(weatherData.main.temp);
        const description = weatherData.weather[0].description;
        const icon = "http://openweathermap.org/img/wn/" +weatherData.weather[0].icon+ "@2x.png";
        
        res.write("<p>The weather in " + weatherData.name + " is currently " + description + ".</p>");
        res.write("<h1>The temperature in " + weatherData.name + " is " + temp+ " degrees C.</h1>");
        res.write("<img src=" +icon+ ">");
        

        }else{

            res.write("<h1>OH NO! Something went wrong... Try again!</h1>")
        }
            res.send();
    })
    })        
})

app.listen(8080, function () {
    console.log("Listening on Port 8080");
});
