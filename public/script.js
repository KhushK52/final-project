weatherApiKey = "f89700a444f83562386587df0f909427";
geocodingUrl = "http://api.openweathermap.org/geo/1.0/direct?q=";
//weatherUrl = "https://api.openweathermap.org/data/2.5/weather?"
weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?";
//weatherDescription = document.getElementById("weatherDescription");


// just some functions to test if we can get the data successfully
function testYelp() {
    fetch('/yelp')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}

function testWeather() {
    fetch('/weather')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}

function testNews() {
    fetch('/news')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}

function testReddit(){
    fetch('/reddit')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}

async function apiCall(url) {
  let response = await fetch(url)
  let data = await response.json()
  return data
}

async function getLatLon(city) {

  let formattedUrl = geocodingUrl + city + "&appid=" + weatherApiKey
  let data = await apiCall(formattedUrl)

  return {
    "lat": data[0].lat,
    "lon": data[0].lon
  }
}

function kelvinToCelsius(kel) {
    return kel - 273.15
}

function celsiusToFahrenheit(cel) {
    return (cel * 9/5) + 32
}


async function getWeather(lat, lon) {
  //const lat = 37.8708
  //const lon = -122.2729
  let formattedUrl = weatherUrl + "lat=" + lat + "&lon=" + lon + "&appid=" + weatherApiKey
  let data = await apiCall(formattedUrl)
  console.log(data)

  let descriptions = []
  let kelvins = []
  let celcius = []
  let fahrenheits = []

  for (let i = 0; i < 5; i++) {
    descriptions[i] = data.list[i].weather[0].description
    kelvins[i] = data.list[i].main.temp
    celcius[i] = kelvinToCelsius(kelvins[i])
    fahrenheits[i] = Math.round(celsiusToFahrenheit(celcius[i]))
    celcius[i] =  Math.round(celcius[i])
  }

  return {
    "descriptions": descriptions,
    "fahrenheits": fahrenheits,
    "celcius": celcius,
  }
}

async function setWeatherDescription(city) {
    let coordData = await getLatLon(city)
    const lat = coordData.lat
    const lon = coordData.lon
    let weatherData = await getWeather(lat, lon)

    for (let i = 0; i < 5; i++) {
        document.getElementById("weatherDescription" + i).innerHTML = weatherData.descriptions[i]
        document.getElementById("fahrenheit" + i).innerHTML = weatherData.fahrenheits[i]
        document.getElementById("celcius" + i).innerHTML = weatherData.celcius[i]
    }

}

let city = prompt("Please enter your city:", "Berkeley");
setWeatherDescription(city);

//YELP 
yelpRating=document.getElementById('yelpRating')
address=document.getElementById('address')
review=document.getElementById('review')
newRestaurant=document.getElementById('newRestaurant')
yelpBox=document.getElementById('yelpBox')
someUrl=document.getElementById('someUrl')
restaurantName=document.getElementById('restaurantName')

async function getRequest(url){
  const res=await fetch(url);
  const data=await res.json();
  return data
}

async function updateYelpBox() {
  const url = "http://localhost:2023/yelp";
  const response = await getRequest(url);
  //yelpBox.value=`<a href="${response.url}"</a>`;
  restaurantName.innerHTML = `<a href="${response.url}" target="_blank">${response.name}</a>`
  yelpRating.innerHTML='<span style="font-weight:bold;">Rating: </span>'+ response.rating + ' stars'
  address.innerHTML = '<span style="font-weight:bold;">Address: </span>' + response.address;
  review.innerHTML = '<span style="font-weight:bold;">Recent Review: </span>' + response.recent_review;

}

updateYelpBox()

newRestaurant.onclick=()=>{
  updateYelpBox()
 }



//NEWS

newsRow1=document.getElementById('newsRow1')
newsRow2=document.getElementById('newsRow2')
newsRow3=document.getElementById('newsRow3')

 newsBox=document.getElementById('newsBox')



async function updateNews() {
  const url = "http://localhost:2023/news";
  const response = await getRequest(url);
  //yelpBox.value=`<a href="${response.url}"</a>`;
  newsRow1.innerHTML=`<p>${response.publishedAt[0]}</p>`+ `<a href="${response.url[0]}"><h2>${response.title[0]}</h2></a>`
  newsRow2.innerHTML=`<p>${response.publishedAt[1]}</p>`+ `<a href="${response.url[1]}"><h2>${response.title[1]}</h2></a>`
  newsRow3.innerHTML=`<p>${response.publishedAt[2]}</p>`+ `<a href="${response.url[2]}"><h2>${response.title[2]}</h2></a>`

}

updateNews()


//REDDIT


redditRow1=document.getElementById('redditRow1')
redditRow2=document.getElementById('redditRow2')
redditRow3=document.getElementById('redditRow3')

 newsBox=document.getElementById('newsBox')



async function updateReddit() {
  const url = "http://localhost:2023/reddit";
  const response = await getRequest(url);
  //yelpBox.value=`<a href="${response.url}"</a>`;
  redditRow1.innerHTML=`<div style="display: flex; justify-content: flex-start; align-items: center; position: relative;">
  <p>Posted: ${response.time_ago[0]} hours ago</p>
  <p style="text-align: center; position: absolute; left: 50%; transform: translateX(-50%); margin: 0;">Upvotes: ${response.upvotes[0]}</p>
  <p style="position: absolute; right: 0.5%;">Flair: ${response.flair[0]}</p>
</div>
<div style="display: block;">
  <a href="${response.url[0]}"><h2>${response.title[0]}</h2></a>
</div>`

  redditRow2.innerHTML=`<div style="display: flex; justify-content: flex-start; align-items: center; position: relative;">
  <p>Posted: ${response.time_ago[1]} hours ago</p>
  <p style="text-align: center; position: absolute; left: 50%; transform: translateX(-50%); margin: 0;">Upvotes: ${response.upvotes[1]}</p>
  <p style="position: absolute; right: 0.5%;">Flair: ${response.flair[1]}</p>
</div>
<div style="display: block;">
  <a href="${response.url[1]}"><h2>${response.title[1]}</h2></a>
</div>`

  redditRow3.innerHTML=`<div style="display: flex; justify-content: flex-start; align-items: center; position: relative;">
  <p>Posted: ${response.time_ago[2]} hours ago</p>
  <p style="text-align: center; position: absolute; left: 50%; transform: translateX(-50%); margin: 0;">Upvotes: ${response.upvotes[2]}</p>
  <p style="position: absolute; right: 0.5%;">Flair: ${response.flair[2]}</p>
</div>
<div style="display: block;">
  <a href="${response.url[2]}"><h2>${response.title[2]}</h2></a>
</div>`

}

updateReddit()