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

async function getWeather(lat, lon) {
  /* YOUR CODE HERE */
  //const lat = 37.8708
  //const lon = -122.2729
  let formattedUrl = weatherUrl + "lat=" + lat + "&lon=" + lon + "&appid=" + weatherApiKey
  let data = await apiCall(formattedUrl)
  console.log(data)

  let description1 = data.list[0].weather[0].description
  let kelvin1 = data.list[0].main.temp
  let celcius1 = kelvin1 - 273.15
  let fahrenheit1 = (celcius1 * 9/5) + 32

  let description2 = data.list[1].weather[0].description
  let kelvin2 = data.list[1].main.temp
  let celcius2 = kelvin2 - 273.15
  let fahrenheit2 = (celcius2 * 9/5) + 32

  let description3 = data.list[2].weather[0].description
  let kelvin3 = data.list[2].main.temp
  let celcius3 = kelvin3 - 273.15
  let fahrenheit3 = (celcius3 * 9/5) + 32

  let description4 = data.list[3].weather[0].description
  let kelvin4 = data.list[3].main.temp
  let celcius4 = kelvin4 - 273.15
  let fahrenheit4 = (celcius4 * 9/5) + 32

  let description5 = data.list[4].weather[0].description
  let kelvin5 = data.list[4].main.temp
  let celcius5 = kelvin5 - 273.15
  let fahrenheit5 = (celcius5 * 9/5) + 32

  return {
    "description1": description1,
    "fahrenheit1": Math.round(fahrenheit1),
    "celcius1": Math.round(celcius1),
    
    "description2": description2,
    "fahrenheit2": Math.round(fahrenheit2),
    "celcius2": Math.round(celcius2),
    
    "description3": description3,
    "fahrenheit3": Math.round(fahrenheit3),
    "celcius3": Math.round(celcius3),
    
    "description4": description4,
    "fahrenheit4": Math.round(fahrenheit4),
    "celcius4": Math.round(celcius4),

    "description5": description5,
    "fahrenheit5": Math.round(fahrenheit5),
    "celcius5": Math.round(celcius5),
  }
}

async function setWeatherDescription() {
    let coordData = await getLatLon(city)
    const lat = coordData.lat
    const lon = coordData.lon
    let weatherData = await getWeather(lat, lon)

    document.getElementById("weatherDescription1").innerHTML = weatherData.description1
    document.getElementById("fahrenheit1").innerHTML = weatherData.fahrenheit1
    document.getElementById("celcius1").innerHTML = weatherData.celcius1

    document.getElementById("weatherDescription2").innerHTML = weatherData.description2
    document.getElementById("fahrenheit2").innerHTML = weatherData.fahrenheit2
    document.getElementById("celcius2").innerHTML = weatherData.celcius2

    document.getElementById("weatherDescription3").innerHTML = weatherData.description3
    document.getElementById("fahrenheit3").innerHTML = weatherData.fahrenheit3
    document.getElementById("celcius3").innerHTML = weatherData.celcius3

    document.getElementById("weatherDescription4").innerHTML = weatherData.description4
    document.getElementById("fahrenheit4").innerHTML = weatherData.fahrenheit4
    document.getElementById("celcius4").innerHTML = weatherData.celcius4

    document.getElementById("weatherDescription5").innerHTML = weatherData.description5
    document.getElementById("fahrenheit5").innerHTML = weatherData.fahrenheit5
    document.getElementById("celcius5").innerHTML = weatherData.celcius5

}

let city = prompt("Please enter your city:", "Berkeley");
setWeatherDescription(city);

