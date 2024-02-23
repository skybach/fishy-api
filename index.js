'use strict';

const fs = require('fs'),
    path = require('path'),
    http = require('http');
const swaggerTools = require('swagger-tools');
const morgan = require('morgan');

const swStats = require('swagger-stats');    
const app = require('connect')();
const jsyaml = require('js-yaml');
const serverPort = 3000;

// swaggerRouter configuration
const options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// Use morgan for logging
app.use(morgan('combined'));

// prometheus metrics
// Load your swagger specification 
const apiSpec = require('./swagger.json');
// Enable swagger-stats middleware in express app, passing swagger specification as option 
app.use(swStats.getMiddleware({
  swaggerSpec:apiSpec,
  uriPath: '/metrics'
}));

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
const spec = fs.readFileSync(path.join(__dirname,'api/swagger.yaml'), 'utf8');
const swaggerDoc = jsyaml.load(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Start the server
  const server = http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

  // Handle shutdown signals
  const shutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
});

