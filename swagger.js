const swaggerAutogen = require('swagger-autogen')();
const doc = {
    info : {
        title: 'Express backend',
        description: 'My documentation',
        version: '1.0',
    },
    host : 'localhost:5000'
}

const outputfile = './swagger-output.json'
const routes = ["app.js"]

swaggerAutogen(outputfile, routes, doc);