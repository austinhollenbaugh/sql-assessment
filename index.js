var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://austinhollenbaugh@localhost/assessbox";

var app = express();

app.use(bodyParser.json());
app.use(cors());

//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);

    db.user_create_seed(function(){
      console.log("User Table Init");
    });
    db.vehicle_create_seed(function(){
      console.log("Vehicle Table Init");
    });
});

//START ENDPOINTS

app.get('/api/users', function(req, res, next) {
  db.get_all_users(function(err, users) {
    res.status(200).send(users);
  });
});

app.get('/api/vehicles', function(req, res, next) {
  db.get_all_vehicles(function(err, vehicles) {
    res.status(200).send(vehicles);
  });
});

app.post('/api/users', function(req, res, next) {
  console.log(req.body);
  db.add_user([req.body.firstname, req.body.lastname, req.body.email], function(err, response) {
    // console.log(err);
    res.status(200).send(req.body);
  });
});

//correctly adds, but request times out in postman
app.post('/api/vehicles', function(req, res, next) {
  console.log(req.body);
  db.vehicles.insert(req.body);
});

//works
app.get('/api/user/:userId/vehiclecount', function(req, res, next) {
  var user = req.params.userId;
  db.get_vehicle_count(user, function(err, user) {
    res.status(200).send(user);
  });
});

//works
app.get('/api/user/:userId/vehicle', function(req, res, next) {
  db.get_user_vehicles(req.params.userId, function(err, user) {
    res.status(200).send(user);
  });
});

//email works
app.get('/api/vehicle', function(req, res, next) {
  if(req.query.email) {
    // will find all vehicles that belong to the user with the provided users Email
    var email = req.query.email;
    db.get_vehicles_by_email(email, function(err, vehicles) {
      console.log(req.query.email);
      res.status(200).send(vehicles);
    });
  } else if (req.query.userFirstStart) {
    // get all vehicles for any user whose first name starts with the provided letters
    var letters = req.query.userFirstStart;
    db.get_vehicles_by_start_letters(letters, function(err, resp) {
      // console.log('it worked');
      if(err){
    		res.send(err);
    	} else {
    		res.send(resp);
    	}
    });
  }
});




//works
app.get('/api/newervehiclesbyyear', function(req, res, next) {
  db.vehicles_sorted_by_year(function(err, vehicles) {
    res.status(200).send(vehicles);
  });
});

//works
app.put('/api/vehicle/:vehicleId/user/:userId', function(req, res, next) {
  var vehicleId = req.params.vehicleId;
  var userId = req.params.userId;
  db.vehicles.update({id: vehicleId, ownerid: userId}, function(err, resp){
    if(err){
  		res.send(err);
  	} else {
  		res.send(resp);
  	}
  });
});

//works
app.delete('/api/user/:userId/vehicle/:vehicleId', function(req, res, next) {
  var userId = req.params.userId;
  var vehicleId = req.params.vehicleId;
  db.vehicles.update({id: vehicleId, ownerid: null}, function(err, resp){
    if(err){
  		res.send(err);
  	} else{
      res.send(resp);
  	}
  });
});

//works
app.delete('/api/vehicle/:vehicleId', function(req, res, next) {
  var vehicleId = req.params.vehicleId;
  db.vehicles.destroy({id: vehicleId}, function(err, resp){
    if(err){
  		res.send(err);
  	} else {
  		res.send(resp);
  	}
  });
});

//END ENDPOINTS

app.listen('3000', function(){
  console.log("Successfully listening on : 3000");
});

module.exports = app;
