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
  var boughtCarsArray = order.boughtCars;

  db.query(
    `INSERT INTO tbl_order (userId, totalPrice, purchaseDate) VALUES (?,?,?)`,
    [order.userId, order.totalPrice, order.purchaseDate],
    (err, result) => {
      if(err) 
        cb(err, null);

      //get orderId of last row in tbl_order
      db.query("SELECT orderId FROM tbl_order ORDER BY orderId DESC LIMIT 1", (err, lastRow) => { 
        
        var counter = 0;
        boughtCarsArray.forEach((ele) => {
          //insert orderitems using just created orderId
          db.query("INSERT INTO tbl_orderitem (orderId, carId) VALUES (?,?)", [lastRow[0].orderId, ele], (err, result) => {
            counter++;
            if(counter === boughtCarsArray.length)
              cb();
          });
        });
      });
  });
}