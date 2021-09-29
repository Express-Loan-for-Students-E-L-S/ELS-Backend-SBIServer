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
})


server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure())
console.log('Server running at http://127.0.0.1:50051')
server.start()