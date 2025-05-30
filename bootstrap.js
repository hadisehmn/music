// const express = require('express');
// const app = express();
// app.use(express.json());



// const Controller = require('./controller')
// const Service = require('./service')
// const Data = require('./data')
// const data = new Data ('./music_list.db')
// const service = new Service (data)
// Controller.Routes(app ,service);


// app.listen(9090, (err) => {
//     if (err) {
//         console.error('Failed to start server:', err);
//     } else {
//         console.log(' Server started successfully on port 9090');
//     }
// });

require('dotenv').config();
const express = require('express');
const logger = require('./logger'); // Assuming this is your custom logger


// Correct file paths based on your folder structure
const Controller = require('./controllers/controller');
  const Service = require('./services/service');
const Data = require('./data/data');

// Initialize app
const app = express();
app.use(express.json());

// Initialize data, service, and setup routes
const data = new Data('./music_list.db');
const service = new Service(data);
Controller.Routes(app, service); // Assumes `Routes` is a method that registers routes

// Start the server
const PORT = process.env.PORT || 9090;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});