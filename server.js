/*
    Type 'node server.js' in the terminal to start the server then visit localhost:2023 in your browser to see the site
*/

// Imports
const express = require("express");
const newsApi = require("newsapi");
const axios = require("axios");
const cors = require("cors");
const yelp = require('yelp-fusion');
const client = yelp.client("CZrlXB5_Zr9EZfPh0KWiPQaBUXtqY7MEz2inggOVIUi0NoAx77hgZ-UDWp-44JkZXJSzhBDxarScb6AFWZQMmBwUrsdhGN7nqEijTaMj2A3EiwiIqCEebVHMCAcpZHYx");
const bodyParser = require('body-parser');
const newsapi = new newsApi("443d03c9e90443cdad2471c1896ecf96");
const app = express();


// Database Start Up
const startDatabase = require("./config/db");
const Task = require("./config/Task");
startDatabase();

app.use(cors());
app.use(express.static('public'))
app.use(express.json());
app.use(bodyParser.json());


// Routes
app.get('', (req, res )=> {
    res.render(__dirname + 'index.html');
})

app.get('/', (req, res) => {
    res.render(__dirname + 'index.html');
})


/*
    @description: sends all tasks in the database as a response
    @status: works correctly
*/
app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
})

/*
    @description: sends all tasks in the database with matching tag as a response
    @status: works correctly
*/
app.get('/tasks/:tag', async (req, res) => {
    const tasks = await Task.find({tag: req.params.tag})
    res.json(tasks);
})

/*
    @description: creates tasks with specified title and tag
    @status: works correctly
*/
app.post('/createTask', async (req, res) => {
    const newTask = new Task({title: req.query.title, tag: req.query.tag});
    await newTask.save();
    res.json(newTask);
})

/*
    @description: deletes task from database with matching id
    @status: works correctly
*/
app.post('/deleteTask/:id', async (req, res) => {
    const foundTask = await Task.deleteOne({id : req.params.id});
    res.send(foundTask);
})


/*
    @description: Returns data about 3 news articles about berkeley
    @return: JSON object
        title: title of the article
        url: url to the article
        publishedAt: date of the article's publication
    @status: works correctly
*/
app.get('/news', (req, res) => {
    newsapi.v2.everything({
        q: '+berkeley',
        searchIn: 'title',
        language: 'en',
        sortBy: 'publishedAt, popularity',
        excludeDomains: 'funcheap.com, google.com',
        pageSize: 3
    }).then(response => {
        let data = {title: [], url: [], publishedAt: []}
        for (var i = 0; i < Math.min(3, response.articles.length); i++) {
            data.title.push(response.articles[i].title);
            data.url.push(response.articles[i].url);
            data.publishedAt.push(response.articles[i].publishedAt.substring(0, 10));
        }
        res.send(data);
    }).catch(error => console.log(error));
})


/*
    @description: Returns data about the day's weather in Berkeley by using the Weather API
    @return: JSON object
        temp: temperature in Fahrenheit
        status: description of the weather
        date: the hour for the data
    @status: works correctly
*/
app.get('/weather', (req, res) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${37.867876}&lon=${-122.255469}&appid=3453ef5a617b0f8aff2cd4426a958d7f&units=imperial`
    axios.get(url)
    .then(response => {
        let data = {temp: [], description:[], hour: []};
        for (var i = 0; i < 8; i++) {
            data.temp.push(response.data.list[i].main.temp);
            data.description.push(response.data.list[i].weather[0].main);
            data.hour.push(response.data.list[i].dt_txt.substring(5, response.data.list[i].dt_txt.length - 3));
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
    @status: works correctly
*/
app.get('/reddit', (req, res) => {
    axios.get("https://www.reddit.com/r/berkeley/hot/.json", {headers: {"Content-Type": "application/json; charset=UTF-8"}})
    .then(response => {
        let data = {time_ago: [], upvotes: [], flair: [], title: [], url: []};
        for (var i = 2; i < 5; i++) {
            let calculated_time = new Date(response.data.data.children[i].data.created_utc * 1000);
            calculated_time = Math.round((new Date() - calculated_time) / 3600000);
            data.time_ago.push(calculated_time);
            data.upvotes.push(response.data.data.children[i].data.ups);
            data.flair.push(response.data.data.children[i].data.link_flair_text);
            data.title.push(response.data.data.children[i].data.title);
            data.url.push(response.data.data.children[i].data.permalink);
        }
        res.send(data);
     })
    .catch(error => console.log(error)) 
})

/*    
    @description: Returns data about a suggested restaurant in Berkeley from the Yelp API
    @return: JSON object
        name: the name of the store
        rating: the rating of the store
        address: the address of the store
        recent_review: the most recent review about the store
        url: url to the store's yelp page
    @status: works correctly
*/
app.get('/yelp', async (req, res) => {
    let data = {id: "", name: "", rating: "", address: "", recent_review: "", url: ""};
    await client.search({
        term: 'restaurants',
        location: 'berkeley, ca'
    }).then(response => {
        let suggestedRestaurant = response.jsonBody.businesses[Math.floor(Math.random() * response.jsonBody.businesses.length)];
        data.id = suggestedRestaurant.id;
        data.name = suggestedRestaurant.name;
        data.rating = suggestedRestaurant.rating;
        data.address = suggestedRestaurant.location.address1;
        data.url = suggestedRestaurant.url;
        
    }).catch(e => { console.log(e) });

    await client.reviews(data.id).then(response => {
        data.recent_review = response.jsonBody.reviews[0].text;
      }).catch(e => { console.log(e)});

    res.send(data);
})

app.listen(2023, () => {console.log("App is running.")});
