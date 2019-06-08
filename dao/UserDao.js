var db = require("../utils/db");


exports.getUser = (userId, cb) => {
  db.query("SELECT * FROM tbl_user WHERE userId=?", userId, (err, result) => {
    if(err)
      cb(err, null);
    if(result.length === 0)
      return cb(`userId=${userId} not found`, null);

    cb(null, result);
  });
}

exports.addUser = (user, cb) => { 
  db.query(
    "INSERT INTO tbl_user (username, password, role, fullname, address, phone) VALUES (?,?,?,?,?,?)",
    [user.username, user.password, user.role, user.fullname, user.address, user.phone],
    (err, result) => {
      if(err) 
        cb(err, null);
        
      cb(null, result);
    });
}

exports.updateUser = (user, userId, cb) => {
  //check first if userId exists
  this.getUser(userId, (err, result) => {
    //user doesn't exist
    if(result === null)
      return cb(`update failed. ${err}`, null);

    //user exists, so do update
    var sql = `UPDATE tbl_user 
               SET username=?, password=?, role=?, fullname=?, address=?, phone=? 
               WHERE userId=?`;
    db.query(
      sql, 
      [user.username, user.password, user.role, user.fullname, user.address, user.phone, userId], 
      (err, result) => {
        if(err) 
          cb(err, null);

        cb(null, result);
      });
  });
}

exports.deleteUser = (userId, cb) => {
  this.getUser(userId, (err, result) => {
    //user doesn't exist
    if(result === null)
      return cb(`delete failed. ${err}`, null);

    db.query("DELETE FROM tbl_user WHERE userId=?", userId, (err, result) => {
      if(err) 
        cb(err, null);

      cb(null, result);
    });
  });
}
