var db = require("../utils/db");


exports.getAllUserOrders = (userId, cb) => {
  var sql = `SELECT * FROM tbl_order 
             JOIN tbl_user ON tbl_user.userId = tbl_order.userId 
             WHERE tbl_order.userId = ?`;
  
  db.query(sql, userId, (err, result) => {
    if(err)
      return cb(err, null);
    if(result.length === 0)
      return cb(`userId=${userId} does not exist`, null);

    reformatJoinedUserResult(result, cb);    
  });
};

reformatJoinedUserResult = (result, cb) => {
  var counter = 0;
  var user = {};
  result.forEach((obj) => {
    //manually create the user object
    user.userId = obj.userId;
    user.username = obj.username;
    user.password = obj.password;
    user.role = obj.role;
    user.fullname = obj.fullname;
    user.address = obj.address;
    user.phone = obj.phone;

    //add user object to result
    result[counter].userId = user;

    //remove misplaced values
    delete result[counter].username;
    delete result[counter].password;
    delete result[counter].role;
    delete result[counter].fullname;
    delete result[counter].address;
    delete result[counter].phone;

    counter++;
    user = {};  //reset
  });

  cb(null, result);  //done
}

exports.getAllItemsFromOrder = (orderId, cb) => {
  var sql = `SELECT * FROM tbl_orderitem 
             JOIN tbl_car ON tbl_car.carId = tbl_orderitem.carId
             WHERE tbl_orderitem.orderId = ?`;

  db.query(sql, orderId, (err, result) => {
    if(err)
      return cb(err, null);
    if(result.length === 0)
      return cb(`orderId=${orderId} does not exist`, null);

    reformatJoinedCarResult(result, cb);  
  });
};

reformatJoinedCarResult = (result, cb) => {
  var counter = 0;
  var car = {};
  result.forEach((obj) => {
    //manually create the car object
    car.carId = obj.carId;
    car.type = obj.type;
    car.make = obj.make;
    car.model = obj.model;
    car.year = obj.year;
    car.price = obj.price;
    car.numAvailable = obj.numAvailable;
    car.carspecId = obj.carspecId;
    car.diagonalView = obj.diagonalView;
    car.sideView = obj.sideView;
    car.interiorView = obj.interiorView;

    //add car object to result
    result[counter].carId = car;

    //remove misplaced values
    delete result[counter].type;
    delete result[counter].make;
    delete result[counter].model;
    delete result[counter].year;
    delete result[counter].price;
    delete result[counter].numAvailable;
    delete result[counter].carspecId;
    delete result[counter].diagonalView;
    delete result[counter].sideView;
    delete result[counter].interiorView;

    //keep just orderId and carId object
    delete result[counter].orderitemId;

    counter++;
    car = {};  //reset
  });

  cb(null, result);  //done
}


exports.addOrder = (order, cb) => {
  var totalPrice = 0;
  var counter = 0;
  order.boughtCars.forEach((id) => {
    db.query("SELECT price FROM tbl_car WHERE carId=?", id, (err, result) => {      
      if(err) return cb(err, null);

      totalPrice = totalPrice + result[0].price;

      counter++;
      if(counter === order.boughtCars.length) {
        useTotalPrice(order, totalPrice, cb);
      }
    });
  });
}

useTotalPrice = (order, totalPrice, cb) => {
  db.query(`INSERT INTO tbl_order (userId, totalPrice, purchaseDate) VALUES (?,?,?)`,
    [order.userId, totalPrice, order.purchaseDate],
    (err, result) => {
      if(err) return cb(err, null);

      //get orderId of last row in tbl_order
      db.query("SELECT orderId FROM tbl_order ORDER BY orderId DESC LIMIT 1", (err, lastRow) => {    
        if(err) return cb(err, null);

        var counter = 0;
        order.boughtCars.forEach((id) => {
          //insert orderitems using just created orderId
          db.query("INSERT INTO tbl_orderitem (orderId, carId) VALUES (?,?)", 
            [lastRow[0].orderId, id], 
            (err, result) => {
              counter++;
              if(counter === order.boughtCars.length)
                updateNumCarsAvailable(order, cb);
          });
        });
      });
  });
}

updateNumCarsAvailable = (order, cb) => {
  var carsMap = new Map();
  var boughtCarsArray = order.boughtCars;

  //save bought car quantities in a map
  for(var i=0; i<boughtCarsArray.length; i++) {
    if(carsMap.has(boughtCarsArray[i]))
      carsMap.set(boughtCarsArray[i], carsMap.get(boughtCarsArray[i]) + 1);
    else
      carsMap.set(boughtCarsArray[i], 1);
  }

  //update car availability
  var counter = 0;
  carsMap.forEach((key, value) => {
    db.query("SELECT numAvailable FROM tbl_car WHERE carId=?", key, (err, numAvail) => {
      if(err) return cb(err, null);
      var subtractNumAvail = numAvail[0].numAvailable - carsMap.get(key);

      db.query("UPDATE tbl_car SET numAvailable=? WHERE carId=?", 
        [subtractNumAvail, key], 
        (err, result) => {
          counter++;
          if(counter === carsMap.size)
            cb();  //all done
      });
    });
  });
}