var db = require("../utils/db");


exports.getAllUserOrders = (userId, cb) => {
  db.query("SELECT * FROM tbl_order WHERE userId=?", userId, (err, result) => {
    if(err)
      return cb(err, null);
    if(result.length === 0)
      return cb(`userId=${userId} does not exist`, null);

    var counter = 0;
    result.forEach((obj) => {
      db.query("SELECT * FROM tbl_user WHERE userId=?", obj.userId, (err, userObj) => {
        //replace userId with its object version
        result[counter].userId = userObj[0];  

        counter++;
        if(counter === result.length) {
          cb(null, result);  //sends final result when forEach is done
        } 
      });
    });    
  });
};

exports.getAllItemsFromOrder = (orderId, cb) => {
  db.query("SELECT orderId, carId FROM tbl_orderitem WHERE orderId=?", orderId, (err, result) => {
    if(err)
      return cb(err, null);
    if(result.length === 0)
      return cb(`orderId=${orderId} does not exist`, null);

    var counter = 0;
    result.forEach((obj) => {
      db.query("SELECT * FROM tbl_car WHERE carId=?", obj.carId, (err, carObj) => {
        //replace carId with its object version
        result[counter].carId = carObj[0];  

        counter++;
        if(counter === result.length) {
          cb(null, result);
        } 
      });
    });    
  });
};

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

  //store bought car quantities in a map
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