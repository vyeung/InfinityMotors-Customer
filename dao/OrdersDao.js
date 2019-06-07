var db = require("../utils/db");


exports.getAllUserOrders = (userId, cb) => {
  db.query("SELECT * FROM tbl_order WHERE userId=?", userId, (err, result) => {
    if(err)
      return cb(err, null);
    if(result.length === 0)
      return cb("userId does not exist", null);

    db.query("SELECT * FROM tbl_user WHERE userId=?", result[0].userId, (err, userObj) => {
      if(err)
        cb(err, null);

      //replace int userId with its object version
      result[0].userId = userObj[0];  
    });

    db.query("SELECT * FROM tbl_car WHERE carId=?", result[0].carId1, (err, car1Obj) => {
      if(err)
        cb(err, null);

      //replace int carId1 with its object version
      result[0].carId1 = car1Obj[0];  
    });

    db.query("SELECT * FROM tbl_car WHERE carId=?", result[0].carId2, (err, car2Obj) => {
      if(err) {
        cb(null, result);  //full result with userObj and car1Obj
      }
      else {
        result[0].carId2 = car2Obj[0]; //replace int carId2 with its object version
        cb(null, result);              //full result with userObj, car1Obj, car2Obj
      } 
    });
  });
};

exports.addOrder = (order, cb) => { 
  //a connection is implicitly established by invoking query()
  db.query(
    `INSERT INTO tbl_order (userId, carId1, carId2, totalPrice, purchaseDate) VALUES (?,?,?,?,?)`,
    [order.userId, order.carId1, order.carId2, order.totalPrice, order.purchaseDate],
    (err, result) => {
      if(err) 
        cb(err, null);
        
      cb(null, result);
    });
}