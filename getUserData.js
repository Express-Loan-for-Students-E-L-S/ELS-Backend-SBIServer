const client = require('./client')

let phno = {
    phoneNum: "02223615184"
}

client.getUserBankInfo(phno, (error, userBankDetails) => {
    if (!error) {
        console.log('successfully fetch List userBankDetails')
        console.log(userBankDetails)
    } else {
        console.log(error)
    }
})