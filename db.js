const mongoose = require("mongoose");

const BankDetail = mongoose.model(
  "BankDetail",
  new mongoose.Schema({
    fname: String,
    lname: String,
    gender: String,
    address: String,
    phoneNum: String,
    dob: String,
    adharNum: String,
    panNum: String,
    accountNum: String,
    ifscCode: String,
    accountType: String,
    bankStatement: String
  })
);

mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.bankDetail = BankDetail;

module.exports = db;