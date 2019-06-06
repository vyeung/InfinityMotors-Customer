var db = require("../utils/db");


exports.getAllUserOrders = (userId, cb) => {
  db.query("SELECT * FROM tbl_order WHERE userId=?", userId, (err, result) => {
    if(err)
      return cb(err, null);
    if(result.length === 0)
      return cb("userId does not exist", null);

    db.query("SELECT * FROM tbl_user WHERE userId=?", result[0].userId, (err, objUserId) => {
      if(err)
        cb(err, null);

      //replace int userId with its object version
      result[0].userId = objUserId[0];  
    });

    db.query("SELECT * FROM tbl_car WHERE carId=?", result[0].carId1, (err, objCarId1) => {
      if(err)
        cb(err, null);

      //replace int carId1 with its object version
      result[0].carId1 = objCarId1[0];  
    });

    db.query("SELECT * FROM tbl_car WHERE carId=?", result[0].carId2, (err, objCarId2) => {
      if(err) {
        cb(null, result);  //full result with objUserId and objCarId1
      }
      else {
        result[0].carId2 = objCarId2[0]; //replace int carId2 with its object version
        cb(null, result);                //full result with objUserId, objCarId1, objCarId2
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