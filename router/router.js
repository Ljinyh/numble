const express = require('express');
const router = express.Router();

const ctrl = require("../controller/index");
const authMiddleware = require("../middleware/authMiddleware");
const wrapAsync = require("../middleware/errorHandler");

router.get("/test", wrapAsync(ctrl.test));

// 회원가입
router.post("/user/reg", wrapAsync(ctrl.signup));

// 회원삭제
router.post("/user/unreg", authMiddleware, wrapAsync(ctrl.withdrawal));

//로그인
router.post("/auth/login", wrapAsync(ctrl.signin));

//Get List
router.get("/doctor/list", authMiddleware, wrapAsync(ctrl.doctorList));

//Get doctor Detail
router.get("/doctor", authMiddleware, wrapAsync(ctrl.doctor));

// register
router.post("/std/reg", authMiddleware, wrapAsync(ctrl.register));

//doctorPost
router.post('/doctorPost', authMiddleware, wrapAsync(ctrl.doctorPost));

//doctorInfoPost
router.post('/doctorInfoPost', authMiddleware, wrapAsync(ctrl.doctorDetailPost));

module.exports = router;