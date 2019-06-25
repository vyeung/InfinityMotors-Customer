var expect = require("chai").expect;
var carsDao = require("../dao/CarsDao");

describe("getAllCarsOfType()", () => {
  it("gets all cars of specified type", () => {
    var carType = "compact";
    carsDao.getAllCarsOfType(carType, (err, result) => {
      result.forEach((obj) => {
        expect(obj.type).to.be.equal(carType);  
      })  
    });
  })
});
