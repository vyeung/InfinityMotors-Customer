var routes = require("express").Router();
var ordersDao = require("../dao/OrdersDao");
var carsDao = require("../dao/CarsDao");


//get all cars of a type
routes.get("/cars/:carType", (req, res) => {
  var carType = req.params.carType;

  carsDao.getAllCarsOfType(carType, (err, result) => {
    if(err) {
      res.status(400).json({"error": err});
    }
    else {
      res.status(200).send(result);
    }
  });
});


//get one car of a type
routes.get("/cars/:carType/:carId", (req, res) => {
  var carType = req.params.carType;
  var carId = req.params.carId;

  carsDao.getOneCarofType(carType, carId, (err, result) => {
    if(err) {
      res.status(400).json({"error": err});
    }
    else {
      res.status(200).send(result);
    }
  });
});


//get all orders for specific user
routes.get("/orders/user/:id", (req, res) => {
  var userId = req.params.id;

  ordersDao.getAllUserOrders(userId, (err, result) => {
    if(err) {
      res.status(400).json({"error": err});
    } 
    else {
      res.status(200).send(result);
    }
  });
});


//add an order
routes.post('/orders', (req, res) => {
  var order = req.body;

  ordersDao.addOrder(order, (err, result) => {
    if(err) {
      res.status(400).json({"status": 400, "error": err});
    }
    else { 
      res.status(201).send();
    }
  });
});

module.exports = routes;