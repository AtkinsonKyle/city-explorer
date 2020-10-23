'use strict';
// Bring dependencies
const express = require('express');
const pg = require('pg');
const cors = require('cors');
const superagent = require('superagent');

// Environment Variables
require('dotenv').config();

// Declare port for server to listen on
const PORT = process.env.PORT || 3000;

// Set up application
const app = express();
app.use(cors());

// Create our postgres client
const client = new pg.Client(process.env.DATABASE_URL);

// Routes
app.get('/location', locationHandler);
app.get('/weather', weatherHandler);
app.get('/trails', trailHandler);

// Location
function locationHandler(request, response) {
  let city = request.query.city;
  let key = process.env.LOCATION_IQ_API_KEY;
  const URL = `https://us1.locationiq.com/v1/search.php?key=${key}&q=${city}&format=json`;
  superagent.get(URL)
    .then(data => {
      let location = new Location(data.body[0], city);
      response.status(200).json(location);
    })
    .catch(error => {
      response.status(500).send('This isn\'t working, try something else');
      console.log('error', error);
    });
}

// Weather
function weatherHandler(request, response) {
  let city = request.query.search_query;
  let key = process.env.WEATHERBIT_API_KEY;
  const URL = (`http://api.weatherbit.io/v2.0/forecast/daily/current?city=${city}&country=United%20States&key=${key}&days=7`);
  superagent.get(URL)
    .then(data => {
      let weatherArray = data.body.data.map(day => {
        let stringDay = new Date(day.ts * 1000).toDateString();
        return new Weather(stringDay, day);
      });
      response.status(200).json(weatherArray);
      response.send(weatherArray);
    })
    .catch((error) => {
      console.log('error', error);
      response.status(500).send('This isn\'t working, try something else');
    });
}

// Trail
function trailHandler(request, response) {
  let lat = request.query.latitude;
  let lon = request.query.longitude;
  let key = process.env.TRAILS_API_KEY;
  const URL = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&key=${key}&days=10`;
  console.log(URL);
  superagent.get(URL)
    .then(data => {
      let eachTrail = data.body.trails.map(trail => {
        let timeDateSplit = trail.conditionDate.split('');
        return new Trails(trail, timeDateSplit);
      });

      response.status(200).send(eachTrail);
      response.send(eachTrail);
    })
    .catch(error => {
      response.status(500).send('This isn\'t working, try something else');
      console.log('error', error);
    });
}

// Constructors

function Weather(obj) {
  this.time = new Date(obj.valid_date).toDateString();
  this.forecast = obj.weather.description;
}

function Location(query, obj) {
  this.latitude = obj.lat;
  this.longitude = obj.lon;
  this.search_query = query;
  this.formatted_query = obj.display_name;
}

function Trails(obj) {
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionDetails;
  this.condition_date = obj.conditionDate;
  this.condition_time = obj.condition_time;
}

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`We are on!`);
    });
  })
  .catch(error => {
    console.log('umm, you screwed up, this is why:', error);
  });

// Start server
// app.listen(PORT, () => {
//   console.log(`Server is now listening on port ${PORT}`);
// });
