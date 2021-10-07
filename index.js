require('dotenv').config();

const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const { v4: uuidv4 } = require('uuid');

// Setting up MongoDB
const db = require("./db.js");
const BankDetail = db.bankDetail
db.mongoose
    .connect(process.env.MONGOURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Successfully connect to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

const packageDefinition = protoLoader.loadSync('bank.proto');
const bankProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server()
server.addService(bankProto.BankService.service, {
    getUserBankInfo: (call, callback) => {
        let phno = call.request.phoneNum;
        BankDetail.findOne({
            phoneNum : phno
        })
        .exec((err, userBankDetails) => {
            if (err) {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: err.toString()
                })
            }
            if(userBankDetails) {
                callback(null, {
                    fname: userBankDetails.fname,
                    lname: userBankDetails.lname,
                    gender: userBankDetails.gender,
                    address: userBankDetails.address,
                    phoneNum: userBankDetails.phoneNum,
                    dob: userBankDetails.dob,
                    adharNum: userBankDetails.adharNum,
                    panNum: userBankDetails.panNum,
                    accountNum: userBankDetails.accountNum,
                    ifscCode: userBankDetails.ifscCode,
                    accountType: userBankDetails.accountType,
                    bankStatement: userBankDetails.bankStatement
                })
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Not found"
                })
            }
        })
    },

    requestLoanOptions: (call, callback) => {
        callback(null, {
            loanOptions: [
                {
                    bankName: "State Bank of India",
                    maxAmount: 1000000,
                    rateOfInterest: 5,
                    duration: 5,
                    collateral: 1000000
                },
                {
                    bankName: "ICICI",
                    maxAmount: 1200000,
                    rateOfInterest: 8,
                    duration: 7,
                    collateral: 1600000
                },
                {
                    bankName: "Bank of Baroda",
                    maxAmount: 800000,
                    rateOfInterest: 5,
                    duration: 6,
                    collateral: 500000
                },
                {
                    bankName: "HDFC",
                    maxAmount: 1150000,
                    rateOfInterest: 6,
                    duration: 4,
                    collateral: 1000000
                },
            ]
        })
    }

})

// string bankName = 1;
//     int32 maxAmount = 2;
//     float rateOfInterest = 3;
//     int32 duration = 4;
//     int32 collateral = 5;
server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure())
console.log('Bank Server running at http://127.0.0.1:50051')
server.start()