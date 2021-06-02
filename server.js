var database_uri = "mongodb+srv://DevonteWhitely:August01@cluster0.fnaqv.mongodb.net/Cluster0?retryWrites=true&w=majority";

// server.js
// where your node app starts

// init project
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var shortid = require('shortid');

var dns = require('dns');

var app = express();
var port = process.env.PORT || 3000;

// mongoose.connect(process.env.DB_URI);
mongoose.connect(database_uri, {useNewUrlParser: true, useUnifiedTopology: true});

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/timestamp", (req, res) => {
  res.sendFile(__dirname + '/views/timestamp.html');
});

app.get("/requestHeaderParser", (req, res) => {
  res.sendFile(__dirname + '/views/requestHeaderParser.html');
});

app.get("/urlShortenerMicroservice", (req, res) => {
  res.sendFile(__dirname + '/views/urlShortenerMicroservice.html');
});

app.get("/exerciseTracker", (req, res) => {
  res.sendFile(__dirname + '/views/exerciseTracker.html')
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// Handle request for Header Parser Microservice
app.get("/api/whoami", (req, res) => {
    res.json({
      ipaddress: req.ip,
      language: req.headers["accept-language"],
      software: req.headers["user-agent"]
    });
});

// Handle request for Timestamp Microservice
app.get("/api/:date?", (req, res) => {
  let dateString = req.params.date;
  let passedInDate = new Date(dateString);
  let nullDate = new Date();
  if (req.params.date == null) {
    return (
      res.json({
        unix: nullDate.getTime(),
        utc: nullDate.toUTCString()
      })
    ); 
  } else if (parseInt(dateString) > 10000) {
      let unixTime = new Date(parseInt(dateString));
      return (
        res.json({
          unix: unixTime.getTime(),
          utc: unixTime.toUTCString()
        })
      );
  } else if (passedInDate == "Invalid Date") {
      return (
        res.json({
          error : "Invalid Date"
        })
      ); 
  } else if (passedInDate) {
    return (
      res.json({
      unix: passedInDate.getTime(),
      utc: passedInDate.toUTCString()
      })
    );
  }
});

// Handle request for URL Shortener Microservice
var ShortURL = mongoose.model('Test', new mongoose.Schema({
  short_url: String,
  original_url: String,
  suffix: String
}));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.post("/api/shorturl", (req, res) => {
  let client_requested_url = req.body.url;
  let suffix = shortid.generate();

  let newURL = new ShortURL({
    original_url: client_requested_url,
    suffix: suffix
  })

  let badURL = new ShortURL({
    error: 'invalid url'
  })

  let shortenedURL = client_requested_url.replace(/(^\w+:|^)\/\//, '');

  if (shortenedURL === client_requested_url) {
    badURL.save((err, doc) => {
      if (err) return console.log(err);
      res.json({
        error: 'invalid url'
      })
    })
  } else {
    newURL.save((err, doc) => {
      if (err) return console.log(err);
        res.json({
          short_url: newURL.suffix,
          original_url: newURL.original_url
        });
      });
  }
});

app.get("/api/shorturl/:suffix", (req, res) => {
  let userGeneratedSuffix = req.params.suffix;
  ShortURL.find({suffix: userGeneratedSuffix}).then(foundUrls => {
    let urlForRedirect = foundUrls[0];
    res.redirect(urlForRedirect.original_url);
  });
});

// Handle request for Exercise Tracker


// listen for requests :)
var listener = app.listen(port, () => {
  console.log('Your app is listening on port ' + listener.address().port + "...");
});
