var routes = require("express").Router();
var ordersDao = require("../dao/OrdersDao");
var carsDao = require("../dao/CarsDao");
var userDao = require("../dao/UserDao");


//get all cars of a type
routes.get("/customer/cars/:carType", (req, res) => {
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
routes.get("/customer/cars/:carType/:carId", (req, res) => {
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
routes.get("/customer/orders/user/:id", (req, res) => {
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

//get all items from an order
routes.get("/customer/order/:id/items", (req, res) => {
  var orderId = req.params.id;

  ordersDao.getAllItemsFromOrder(orderId, (err, result) => {
    if(err) {
      res.status(400).json({"error": err});
    } 
    else {
      res.status(200).send(result);
    }
  });
});

//add an order
routes.post("/customer/orderPurchased", (req, res) => {
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


//get a user
routes.get("/customer/user/:id", (req, res) => {
  var userId = req.params.id;

  userDao.getUser(userId, (err, result) => {
    if(err) {
      res.status(400).json({"status": 400, "error": err});
    }
    else { 
      res.status(200).send(result);
    }
  });
});

//add a user
routes.post("/customer/user", (req, res) => {
  var user = req.body;

  userDao.addUser(user, (err, result) => {
    if(err) {
      res.status(400).json({"status": 400, "error": err});
    }
    else { 
      res.status(201).send();
    }
  });
});

//update a user
routes.put("/customer/user/:id", (req, res) => {
  var user = req.body;
  var userId = req.params.id;

  userDao.updateUser(user, userId, (err, result) => {
    if(err) {
      res.status(400).json({"status": 400, "error": err});
    }
    else { 
      res.status(204).send();
    }
  });
});

//delete a user
routes.delete("/customer/user/:id", (req, res) => {
  var userId = req.params.id;

  userDao.deleteUser(userId, (err, result) => {
    if(err) {
      res.status(400).json({"status": 400, "error": err});
    }
    else { 
      res.status(204).send();
    }
  });
});

module.exports = routes;