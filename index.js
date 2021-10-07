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

    getConnectedBanks: (call, callback) => {
        let phno = call.request.phoneNum;
        BankDetail.find({
            phoneNum: phno
        })
            .exec((err, userBankDetails) => {
                if (err) {
                    callback({
                        code: grpc.status.NOT_FOUND,
                        details: err.toString()
                    })
                }
                if (userBankDetails) {

                    // console.log(userBankDetails);

                    let arr = []
                    for (let i = 0; i < userBankDetails.length; i++) {
                        arr.push({
                            id: userBankDetails[i]._id.toString(),
                            bankName: userBankDetails[i].bankStatement,
                            accountNum: userBankDetails[i].accountNum,
                            accountType: userBankDetails[i].accountType,
                            ifscCode: userBankDetails[i].ifscCode
                        })
                    }
                    console.log(arr);
                    callback(null, {connectedBankAccounts: arr})
                } else {
                    callback({
                        code: grpc.status.NOT_FOUND,
                        details: "Not found"
                    })
                }
            })
    },

    getUserBankInfo: (call, callback) => {
        let id = call.request.id;
        BankDetail.findOne({
            _id: id
        })
            .exec((err, userBankDetails) => {
                if (err) {
                    callback({
                        code: grpc.status.NOT_FOUND,
                        details: err.toString()
                    })
                }
                if (userBankDetails) {
                    callback(null, {
                        id: userBankDetails._id.toString(),
                        fname: userBankDetails.fname,
                        lname: userBankDetails.lname,
                        gender: userBankDetails.gender,
                        address: userBankDetails.address,
                        phoneNum: userBankDetails.phoneNum,
                        dob: userBankDetails.dob,
                        fatherName: userBankDetails.fatherName || '',
                        motherName: userBankDetails.motherName || '',
                        adharNum: userBankDetails.adharNum,
                        panNum: userBankDetails.panNum,
                        accountNum: userBankDetails.accountNum,
                        ifscCode: userBankDetails.ifscCode,
                        accountType: userBankDetails.accountType,
                        bankName: userBankDetails.bankStatement
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
                    id: '1',
                    bankName: 'State Bank of India',
                    maxAmount: 1000000,
                    duration: 5,
                    interestRate: 8.9,
                    colatral: 500000
                },
                {
                    id: '2',
                    bankName: 'Bank of India',
                    maxAmount: 1100000,
                    duration: 5,
                    interestRate: 7.4,
                    colatral: 700000
                },
                {
                    id: '3',
                    bankName: 'Axis Bank',
                    maxAmount: 1400000,
                    duration: 6,
                    interestRate: 9.5,
                    colatral: 600000
                },
                {
                    id: '4',
                    bankName: 'HDFC Bank',
                    maxAmount: 1250000,
                    duration: 6,
                    interestRate: 6.6,
                    colatral: 1100000
                },
                {
                    id: '5',
                    bankName: 'ICICI Bank',
                    maxAmount: 1200000,
                    duration: 4,
                    interestRate: 10,
                    colatral: 600000
                },
                {
                    id: '6',
                    bankName: 'Bank of Baroda',
                    maxAmount: 2000000,
                    duration: 7,
                    interestRate: 7.4,
                    colatral: 1500000
                },
                {
                    id: '7',
                    bankName: 'Yes Bank',
                    maxAmount: 1200000,
                    duration: 4,
                    interestRate: 13.6,
                    colatral: 800000
                },
                {
                    id: '8',
                    bankName: "State Bank of India",
                    maxAmount: 1000000,
                    rateOfInterest: 5,
                    duration: 5,
                    collateral: 700000
                },
                {
                    id: '9',
                    bankName: "ICICI Bank",
                    maxAmount: 1200000,
                    rateOfInterest: 8,
                    duration: 7,
                    collateral: 460000
                },
                {
                    id: '10',
                    bankName: "Bank of Baroda",
                    maxAmount: 800000,
                    rateOfInterest: 5,
                    duration: 6,
                    collateral: 500000
                },
                {
                    id: '11',
                    bankName: "HDFC Bank",
                    maxAmount: 1150000,
                    rateOfInterest: 6,
                    duration: 4,
                    collateral: 1000000
                },
            ]
        })
    }

})

server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure())
console.log('Bank Server running at http://127.0.0.1:50051')
server.start()