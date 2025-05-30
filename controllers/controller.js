const express = require('express');
const app = express();

app.use(express.json());
require('dotenv').config();

const AuthMiddleware = require('./middlewares/Authentication');
const service = require('../services/service');

const PlaylistsRoutes = require('./playlists');
const userRoutes = require('./user');
const musicRoutes = require('./music');

const logger = require('../logger');

const JWT_SECRET = process.env.JWT_SECRET;

class Controller {
    constructor(app, service) {
        this.app = app;
        this.service = service;
    }

    static Routes(app, service) {
        app.use('/playlists', PlaylistsRoutes(service));
        app.use('/user', userRoutes(service));
        app.use('/music', musicRoutes(service));
    }
}

module.exports = Controller;