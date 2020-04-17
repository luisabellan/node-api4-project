"use strict";

require('dotenv').config();

var port = process.env.PORT;

var express = require("express");

var cors = require("cors");

var router = express.Router();

var postsRoutes = require('./posts/postsRoutes');

var welcomeRoute = require('./welcome/welcomeRoute');

var posts = require("./data/db");

var server = express();
server.use(express.json());
server.use(cors());
server.use('/api/', welcomeRoute);
server.use('/api/posts', postsRoutes);
server.listen(port, function () {
  return console.log("API running on port ".concat(port));
});