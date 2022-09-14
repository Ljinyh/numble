const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./db/database");
const morgan = require("morgan");
const helmet = require("helmet");
const { stream } = require("./middleware/logger");
const ctrl = require("./controller/index");
const authMiddleware = require("./middleware/authMiddleware");
const wrapAsync = require("./middleware/errorHandler");
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
app.get("/v3/test", wrapAsync(ctrl.test));

// 회원가입
app.post("/v3/user/reg", wrapAsync(ctrl.signup));

// 회원삭제
app.post("/v3/user/unreg", authMiddleware, wrapAsync(ctrl.withdrawal));

//로그인
app.post("/v3/auth/login", wrapAsync(ctrl.signin));

//Get List
app.get("/v3/doctor/list", authMiddleware, wrapAsync(ctrl.doctorList));

//Get doctor Detail
app.get("/v3/doctor", authMiddleware, wrapAsync(ctrl.doctor));

// register
app.post("/v3/std/reg", authMiddleware, wrapAsync(ctrl.register));

//doctorPost
app.post('/v3/doctorPost', authMiddleware, wrapAsync(ctrl.doctorPost));

//doctorInfoPost
app.post('/v3/doctorInfoPost', wrapAsync(ctrl.doctorDetailPost));

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