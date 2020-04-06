const moment = require("moment");
const Location = require('./../models/Location');

/*
 * Create/Add Location for the user
**/
exports.create = function (req, res) {
  if (!req.body.longitude) 
    return res.status(400).send({ status: 400, param: 'longitude', message: 'Longitude cannot be blank.' });
  
  if (isNaN(req.body.longitude))
    return res.status(400).send({ status: 400, param: 'longitude', message: 'Longitude should be number only.' });
  
  if (!req.body.latitude)
    return res.status(400).send({ status: 400, param: 'latitude', message: 'Latitude cannot be blank.' });
  
  if (isNaN(req.body.latitude))
    return res.status(400).send({ status: 400, param: 'latitude', message: 'Latitude should be number only.' });
  
  if (!req.body.date)
    return res.status(400).send({ status: 400, param: 'date', message: 'Date cannot be blank.' });
  
  if (!req.body.time)
    return res.status(400).send({ status: 400, param: 'time', message: 'Time cannot be blank.' });

  if (req.body.type == 'owner') {
    if (!req.body.crowd)
      return res.status(400).send({ status: 400, param: 'crowd', message: 'Crowd cannot be blank.' });

    if (isNaN(req.body.crowd))
      return res.status(400).send({ status: 400, param: 'crowd', message: 'Crowd should be number only.' });
  }

  const splitTime = req.body.time.split(':');
  const time = (parseInt(splitTime[0]) * 60) + parseInt(splitTime[1]);

  let requestData = {
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    date: req.body.date,
    time: time
  };

  const query = {
    is_active: true,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    date: { $eq: req.body.date },
    time: { $eq: time }
  }

  Location.findOne(query, function (err, loc) {
    if (err) return res.status(400).send({ status: 400, message: "There was a problem adding the information to the database." });    
    if (loc) {
      if (req.body.type == 'owner') {
        requestData.crowd = req.body.crowd;
      } else {
        requestData.crowd = loc.crowd + 1;
      }
      
      Location.findByIdAndUpdate(loc._id, requestData).exec((err, success) => {
        if (err) return res.status(400).send({ status: 400, message: 'There was a problem adding the information to the database.' });
        res.status(200).send({ status: 200, message: 'success' });
      });      
    } else {
      if (req.body.type == 'owner') {
        requestData.crowd = req.body.crowd;
      } else {
        requestData.crowd = 1;
      }

      Location.create(requestData, (err, location) => {
        if (err) return res.status(400).send({ status: 400, message: "There was a problem adding the information to the database." });
        res.status(200).send({ status: 200, message: 'success' });
      });
    }    
  });
}


/*
 * Get Location according to lon & lat
**/
exports.fetch = function (req, res) {
  if (!req.body.longitude) 
    return res.status(400).send({ status: 400, param: 'longitude', message: 'Longitude cannot be blank.' });
  
  if (isNaN(req.body.longitude))
    return res.status(400).send({ status: 400, param: 'longitude', message: 'Longitude should be number only.' });
  
  if (!req.body.latitude)
    return res.status(400).send({ status: 400, param: 'latitude', message: 'Latitude cannot be blank.' });
  
  if (isNaN(req.body.latitude))
    return res.status(400).send({ status: 400, param: 'latitude', message: 'Latitude should be number only.' });

  const today = moment().format("YYYY-MM-DD");
  const query = {
    is_active: true,
    longitude: req.body.longitude,
    latitude: req.body.latitude,
    date: { $gte: today }
  }

  Location.find(query, function (err, loc) {
    if (err) return res.status(400).send({ status: 400, message: "There was a problem adding the information to the database." });

    return res.status(200).send({ status: 200, message: 'success', data: loc });  
  });
}


/*
 * Edit Location for the user
**/
exports.edit = function (req, res) {
  let requestData = {};

  if (!req.body.id) 
    return res.status(400).send({ status: 400, param: 'id', message: 'ID cannot be blank.' });

  if (req.body.longitude) {
    if (isNaN(req.body.longitude))
      return res.status(400).send({ status: 400, param: 'longitude', message: 'Longitude should be number only.' });

    requestData.longitude = req.body.longitude;
  }

  if (req.body.latitude) {
    if (isNaN(req.body.latitude))
      return res.status(400).send({ status: 400, param: 'latitude', message: 'Latitude should be number only.' });

    requestData.latitude = req.body.latitude;
  }

  if (req.body.date) {
    requestData.date = req.body.date;
  }

  if (req.body.time) {
    const splitTime = req.body.time.split(':');
    const time = (parseInt(splitTime[0]) * 60) + parseInt(splitTime[1]);
    requestData.time = time;
  }

  Location.findByIdAndUpdate(req.body.id, requestData).exec((err, success) => {
    if (err) return res.status(400).send({ status: 400, message: 'There was a problem updating the information to the database.' });
      res.status(200).send({ status: 200, message: 'success' });
  });         
}


/*
 * Delete Location for the user
**/
exports.delete = function (req, res) {
  if (!req.body.id) 
    return res.status(400).send({ status: 400, param: 'id', message: 'ID cannot be blank.' });

  Location.deleteOne({_id: req.body.id}).exec((err, success) => {
    if (err) return res.status(400).send({ status: 400, message: 'There was a problem deleting the information to the database.' });
      res.status(200).send({ status: 200, message: 'success' });
  });         
}


function time_convert(num) { 
  var hours = Math.floor(num / 60);
  var minutes = num % 60;
  hours = (hours > 9) ? hours : '0' + hours;
  minutes = (minutes > 9) ? minutes : '0' + minutes; 
  return hours + ":" + minutes;     
}
