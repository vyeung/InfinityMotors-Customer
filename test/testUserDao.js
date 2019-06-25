var expect = require("chai").expect;
var userDao = require("../dao/UserDao");

describe("getUser()", () => {
  it("returns a result of size 1", () => {
    var userId= 1;
    userDao.getUser(userId, (err, result) => {
      expect(result.length).to.be.equal(1);
    });
  });

  it("gets user with specified id", () => {
    var userId= 1;
    userDao.getUser(userId, (err, result) => {
      expect(result[0].userId).to.be.equal(userId);
    });
  })
});
