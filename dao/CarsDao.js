var db = require("../utils/db");


exports.getAllCarsOfType = (carType, cb) => {
  db.query("SELECT * FROM tbl_car WHERE type=?", carType, (err, result) => {
    if(err)
      cb(err, null);
    if(result.length === 0)
      return cb("invalid car type", null);
    
    var counter = 0;
    result.forEach((obj) => {
      db.query("SELECT * FROM tbl_carspecs WHERE carspecId=?", obj.carspecId, (err, carSpecObj) => {
        //replace id with carspec object
        result[counter].carspecId = carSpecObj[0];
        
        counter++;
        if(counter === result.length) {
          cb(null, result);  //sends final result when forEach is done
        }
      }); 
    });
  });
}

exports.getOneCarofType = (carType, carId, cb) => {
  db.query("SELECT * FROM tbl_car WHERE carId=? && type=?", [carId, carType], (err, result) => {
    if(err)
      cb(err, null);
    if(result.length === 0)
      return cb(`${carType} with id=${carId} not found`, null);

    db.query("SELECT * FROM tbl_carspecs WHERE carspecId=?", result[0].carspecId, (err, carSpecObj) => {
      result[0].carspecId = carSpecObj[0];
      cb(null, result);  //sends final result when done
    }); 
  });
}
