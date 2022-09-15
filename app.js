const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db/database");
const morgan = require("morgan");
const helmet = require("helmet");
const { stream } = require("./middleware/logger");
const router = require('./router/router');
require("dotenv").config();

// DB connect
connectDB();

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));

// server application
const app = express();

// body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("tiny", { stream }));
app.use(helmet());

//최상위
app.get("/", (req, res) => {
    res.send("Server");
});

//api
app.use('/v3', router);

//Error middleware
app.use(function (error, req, res, next) {
    res.status(200).json({
        status: "nok",
        message: error.message,
    });
});

// port
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`
    ==========================================
    🥰  ${port} server running!   🥰
==========================================`);
});