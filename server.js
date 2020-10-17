'use strict';


// Bring in our dependencies
const express = require('express');
const cors = require('cors');

require('dotenv').config();

// Declare our port for our server to listen on
const PORT = process.env.PORT || 3000;

// start/instanciate Express
const app = express();

// Use CORS (cross origin resource sharing)
app.use(cors());

// Routes
app.get('/', (request, response) => {
  response.send('Hello World');
});

app.get('/location', (request, response) => {
  // getting the data from a database or API, using a flat file
  let city = request.query.city;
  let data = require('./data/location.json')[0];
  let location = new Location(data, city);
  response.send(location);
});

app.get('/weather', (request, response) => {
  let data = require('./data/weather.json');
  let weatherArray = [];
  data.data.forEach(value => {
    let rain = new Weather(value);
    weatherArray.push(rain);
  });
  response.send(weatherArray);
  console.log(weatherArray);
});

// Constructor to tailor our incoming raw data

function Location(obj, query) {
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.search_query = query;
  this.formatted_query = obj.display_name;
}

function Weather(obj) {
  this.forecast = obj.weather.description;
  this.time = obj.valid_date;
}


// Start the server!
app.listen(PORT, () => {
  console.log(`App is listening on ${PORT}`);
});
