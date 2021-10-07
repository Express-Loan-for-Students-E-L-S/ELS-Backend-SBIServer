const client = require('./client')

let phno = {
    phoneNum: "9845317234"
}



// client.GetConnectedBanks(phno, (error, userBankDetails) => {
//     if (!error) {
//         console.log('successfully fetch List userBankDetails')
//         console.log(userBankDetails)
//     } else {
//         console.log(error)
//     }
// })

// client.GetUserBankInfo({id: '6154429765cb7aa5e2fb55a8'}, (error, userBankDetails) => {
//     if (!error) {
//         console.log('successfully fetch List userBankDetails')
//         console.log(userBankDetails)
//     } else {
//         console.log(error)
//     }
// })

client.requestLoanOptions({fname: 'akshay', lname: 'mali'}, (error, userBankDetails) => {
    if (!error) {
        console.log('successfully fetch List userBankDetails')
        console.log(userBankDetails)
    } else {
        console.log(error)
    }
})