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

