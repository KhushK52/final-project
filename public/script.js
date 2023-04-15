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