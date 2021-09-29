const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const PROTO_PATH = './bank.proto'

const packageDefinition = protoLoader.loadSync('bank.proto');
const BankService = grpc.loadPackageDefinition(packageDefinition).BankService;


const client = new BankService(
    'localhost:50051',
    grpc.credentials.createInsecure()
)

module.exports = client