const express = require("express");
const app = express();
const cors = require('cors');
const bodyparser = require("body-parser");

const db = require('./config/database');

const port = process.env.PORT || 3200;

//Middle ware
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Credentials', true);

  if ('OPTIONS' == req.method) {
    res.send(200);
  } else {
    next();
  }
};
app.use(allowCrossDomain);


// Location API
var LocationController = require('./src/controllers/LocationController');
app.post('/api/v1/add_location', LocationController.create);
app.post('/api/v1/get_location', LocationController.fetch);
app.post('/api/v1/edit_location', LocationController.edit);
app.post('/api/v1/delete_location', LocationController.delete);


app.listen(port, () => {
  console.log(`running at port ${port}`);
});
