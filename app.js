const express = require("express");

const https = require("https");
const bodyParser = require("body-parser");

// const handlebars = require("express-handlebars");
const app = express();
app.set("view engine", "ejs");
// //Sets our app to use the handlebars engine
// app.set("view engine", "handlebars");

// //Sets handlebars configurations (we will go through them later on)
// app.engine(
//     "handlebars",
//     handlebars({
//         layoutsDir: __dirname + "/views/layouts",
//     })
// );

require("dotenv").config();

const router = express.Router();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
    const userSearch = req.body.city;
    const apiKey = process.env.API_KEY;
    const url =
        "https://api.openweathermap.org/data/2.5/weather?appid=" +
        apiKey +
        "&q=" +
        userSearch +
        "&units=metric";

    https.get(url, function (response) {
        // console.log(response.statusCode);
        response.on("data", function (data) {
            //parsing data
            const weatherData = JSON.parse(data);
            // console.log("response.status:" , weatherData.cod);
            if (weatherData.cod === 200) {
                const temp = Math.round(weatherData.main.temp);
                const description = weatherData.weather[0].description;
                const icon =
                    "http://openweathermap.org/img/wn/" +
                    weatherData.weather[0].icon +
                    "@2x.png";

                const image = "<img src=" + icon + ">";
                const city = weatherData.name;

                // res.write(
                //     "<p>The weather in " +
                //         weatherData.name +
                //         " is currently " +
                //         description +
                //         ".</p>"
                // );
                // res.write(
                //     "<h1>The temperature in " +
                //         weatherData.name +
                //         " is " +
                //         temp +
                //         " degrees C.</h1>"
                // );
                // res.write("<img src=" + icon + ">");

                res.render("weather", {
                    cityName: city,
                    weatherDescription: description,
                    cityTemp: temp,
                    weatherIcon: icon,
                });
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        });
    });
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(8080, function () {
    console.log("Listening on Port 8080");
});
