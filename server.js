// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

//Handle request to /api/:date?
app.get("/api/:date?", (req, res) => {
  let dateString = req.params.date;
  let passedInDate = new Date(dateString);

  let nullDate = new Date();
  let nullUnix = nullDate.getTime();
  let nullUtc = nullDate.toUTCString();
 
  if (req.params.date == null) {
    return (
      res.json({
        "unix": nullUnix,
        "utc": nullUtc
      })
    ); 
  } else if (passedInDate == "Invalid Date") {
    return (
      res.json({
        "error" : "Invalid Date"
      })
    ); 
  } else {
  let unix = passedInDate.getTime();
  let utc = passedInDate.toUTCString();
  return res.json({"unix": unix, "utc": utc});    
  }
});

//Handle request to /api/1451001600000


// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
