import express from 'express';
import CSVPersonApi from './person/api';

const server = express();

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
server.use(bodyParser.json())

new CSVPersonApi(server); 

server.listen(7678, () => {
    console.log('The application is listening on port 7678!')
})