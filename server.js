// Imports
const express = require("express");
const NewsAPI = require('newsapi');
const axios = require("axios");
const cors = require("cors");
const newsapi = new NewsAPI("443d03c9e90443cdad2471c1896ecf96");
const app = express();


// Database Start Up
const InitiateMongoServer = require("./config/db");
const Task = require("./config/Task");
app.use(cors());
InitiateMongoServer();

app.use(express.static('public'))
app.use(express.json());


// Routes
app.get('', (req, res )=> {
    res.render(__dirname + 'index.html');
})

app.get('/', (req, res) => {
    res.render(__dirname + 'index.html');
})

// Find all tasks
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
})

// Find all tasks with certain tag
app.get('/tasks/:tag', async (req, res) => {
    const tasks = await Task.find({tag: req.params.tag})
    res.json(tasks);
})

// Create task with specified title and tag and save to database
app.post('/createTask', async (req, res) => {
    const newTask = new Task({title: req.query.title, tag: req.query.tag});
    await newTask.save();
    res.json(newTask);
})

// Delete the task with the specified id
app.post('/deleteTask/:id', async (req, res) => {
    const foundTask = await Task.deleteOne({id : req.params.id});
    res.send(foundTask);
})


/*
@description: Returns data about news in berkeley
@return: JSON object
*/
app.get('/news', (req, res) => {
    newsapi.v2.topHeadlines({
        country: 'us',
        q: 'berkeley',
        language: 'en'
    }).then(response => {
        res.send(response);
    })
})


/*
@description: Returns data about the day's weather in Berkeley by using the Weather API
@return: JSON object
    temp: temperature in Fahrenheit
    status: description of the weather
    date: the hour for the data
*/
app.get('/weather', (req, res) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${37.867876}&lon=${-122.255469}&appid=3453ef5a617b0f8aff2cd4426a958d7f&units=imperial`
    axios.get(url)
    .then(response => {
        let data = {temp: [], description:[], hour: []};
        for (const day of response.data.list) {
            data.temp.push(day.main.temp);
            data.description.push(day.weather[0].main);
            data.hour.push(day.dt_txt)
        }
        res.send(data);
    })
    .catch(error => console.log(error))
})


/*
@description: Returns data about 3 "hot" posts on Reddit's Berkeley subreddit
@return: JSON object
    time_ago: number of hours ago the post was created
    upvotes: number of upvotes the post received
    flair: the flair attached to the post
    title: the title of the post
    url: a link to the post
*/
app.get('/reddit', (req, res) => {
    axios.get("https://www.reddit.com/r/berkeley/hot/.json")
    .then(response => {
        let data = {time_ago: [], upvotes: [], flair: [], title: [], url: []};
        for (var i = 2; i < 5; i++) {
            let calculated_time = new Date(response.data.children[i].data.created_utc * 1000);
            calculated_time = Math.round((new Date() - calculated_time) / 3600000);
            data.time_ago.push(calculated_time);
            data.upvotes.push(response.data.children[i].data.ups);
            data.flair.push(response.data.children[i].data.link_flair_text);
            data.title.push(response.data.children[i].data.title);
            data.url.push(result.data.children[i].data.permalink);
        }
        res.send(data);
    })
    .catch(error => console.log(error)) 
})

app.listen(2023, ()=> {console.log("App is running.")});