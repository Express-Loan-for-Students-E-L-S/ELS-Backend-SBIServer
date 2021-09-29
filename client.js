const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')

const PROTO_PATH = './notes.proto'

const packageDefinition = protoLoader.loadSync('notes.proto');
const NoteService = grpc.loadPackageDefinition(packageDefinition).NoteService;


const client = new NoteService(
    'localhost:50051',
    grpc.credentials.createInsecure()
)

module.exports = client