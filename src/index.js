const express = require('express')
const http = require("http");
const log = require("morgan")
const { apiRouter } = require('./routes');

require("dotenv").config();
const app = express()

app.use(log("dev"));
app.use(express.json())
const port = 3000

const server = http.createServer(app);

app.use("/api", apiRouter);

server.listen(port, () => console.log(`Example app listening on port ${port}!`))