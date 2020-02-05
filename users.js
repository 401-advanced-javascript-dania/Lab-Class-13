'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let SECRET = '';

let db = {};

let users = {};

// Because we're using async bcrypt, this function needs to return a value or a promise rejection
users.save = async function (record) {

  if (!db[record.username]) {
    // Hash the password and save it to the user
    record.password = await bcrypt.hash(record.password, 5)

    // Create a new user
    db[record.username] = record;

    return record;

  }

  return Promise.reject();
}

// Because we're using async bcrypt, this function needs to return a value or a promise rejection
users.authenticateBasic = async function (user, pass) {
  let valid = await bcrypt.compare(pass, db[user].password);
  return valid ? db[user] : Promise.reject();
}

users.generateToken = function (user) {
  let token = jwt.sign({ username: user.username }, SECRET)
  return token;
}

users.authenticateToken=async function(token){
try{
  let tokenObject= jwt.verify(token, SECRET)
if(db[tokenObject.username]){
  return Promise.resolve(tokenObject)
}else{
  return Promise.reject()
}
}catch(err){
  return Promise.reject();
}

}
users.list = () => db;

module.exports = users;