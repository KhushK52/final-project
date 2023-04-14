require('dotenv').config();
const express = require("express");
const app = express();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI("API KEY GOES HERE");
const axios = require("axios");

app.use(express.json());
app.set('views', './views');
app.use(express.static('public'))

// Routes
app.get('', (req, res)=> {
    res.render('index.html');
})

app.get('/', (req, res)=> {
    res.render('index.html');
})

app.get('/news', (req, res) => {
    newsapi.v2.topHeadlines({
        country: 'us',
        q: '',
        language: 'en'
    }).then(response => {
        res.send(response);
    })
})

app.get('/weather', (req, res) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${37.867876}&lon=${-122.255469}&appid=${"API KEY GOES HERE"}&units=imperial`
    axios.get(url)
    .then(response => {
        var data = {data: []};
        for (const day of response.data.list) {
            data.data.push({temp: day.main.temp, status: day.weather[0].main, date: day.dt_txt})
        }
        res.send(data);
    })
    .catch(error => console.log(error))
})

app.listen(2023, ()=> {console.log("App is running.")});