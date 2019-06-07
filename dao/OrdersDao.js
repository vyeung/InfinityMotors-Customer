var db = require("../utils/db");


exports.getAllUserOrders = (userId, cb) => {
  db.query("SELECT * FROM tbl_order WHERE userId=?", userId, (err, result) => {
    if(err)
      return cb(err, null);
    if(result.length === 0)
      return cb("userId does not exist", null);

    var counter = 0;
    result.forEach((obj) => {
      db.query("SELECT * FROM tbl_user WHERE userId=?", obj.userId, (err, userObj) => {
        //replace userId with its object version
        result[counter].userId = userObj[0];  
      });

      db.query("SELECT * FROM tbl_car WHERE carId=?", obj.carId1, (err, car1Obj) => {
        //replace carId1 with its object version
        result[counter].carId1 = car1Obj[0];  
      });

      db.query("SELECT * FROM tbl_car WHERE carId=?", obj.carId2, (err, car2Obj) => {
        if(obj.carId2 === null) {
          result[counter].carId2 = null;
        }
        else {
          result[counter].carId2 = car2Obj[0];
        }
  
        counter++;
        if(counter === result.length) {
          cb(null, result);  //sends final result when forEach is done
        }        
      });
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