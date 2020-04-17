require('dotenv').config()
const port = process.env.PORT;

const express = require("express");
const cors = require("cors");

const router = express.Router()
const postsRoutes = require('./posts/postsRoutes')
const welcomeRoute = require('./welcome/welcomeRoute')
const posts = require("./data/db");

const server = express();
server.use(express.json());
server.use(cors())

server.use('/api/', welcomeRoute)
server.use('/api/posts', postsRoutes)

server.listen(port, () => console.log(`API running on port ${port}`));
less