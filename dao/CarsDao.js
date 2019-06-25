var db = require("../utils/db");


exports.getAllCarsOfType = (carType, cb) => {
  var sql = `SELECT * FROM tbl_car 
             JOIN tbl_carspecs ON tbl_carspecs.carspecId = tbl_car.carspecId 
             WHERE tbl_car.type = ?`;

  db.query(sql, carType, (err, result) => {
    if(err)
      cb(err, null);
    if(result.length === 0)
      return cb("invalid car type", null);

    reformatJoinedCarSpecsResult(result, cb);
  });
}

exports.getOneCarofType = (carType, carId, cb) => {
  var sql = `SELECT * FROM tbl_car 
             JOIN tbl_carspecs ON tbl_carspecs.carspecId = tbl_car.carspecId 
             WHERE tbl_car.type=? && tbl_car.carId=?`;

  db.query(sql, [carType, carId], (err, result) => {
    if(err)
      cb(err, null);
    if(result.length === 0)
      return cb(`${carType} with id=${carId} not found`, null);

    reformatJoinedCarSpecsResult(result, cb);
  });
}

reformatJoinedCarSpecsResult = (result, cb) => {
  var counter = 0;
  var carSpec = {};
  result.forEach((obj) => {
    //manually create the carSpec object
    carSpec.carspecId = obj.carspecId;
    carSpec.engine = obj.engine;
    carSpec.transmission = obj.transmission;
    carSpec.color = obj.color;
    carSpec.horsepower = obj.horsepower;
    carSpec.weightLBS = obj.weightLBS;
    carSpec.heightIN = obj.heightIN;
    carSpec.lengthIN = obj.lengthIN;
    carSpec.widthIN = obj.widthIN;

    //add carSpec object to result
    result[counter].carspecId = carSpec;

    //remove misplaced values
    delete result[counter].engine;
    delete result[counter].transmission;
    delete result[counter].color;
    delete result[counter].horsepower;
    delete result[counter].weightLBS;
    delete result[counter].heightIN;
    delete result[counter].lengthIN;
    delete result[counter].widthIN;

    counter++;
    carSpec = {};  //reset
  });

  cb(null, result);  //done
}