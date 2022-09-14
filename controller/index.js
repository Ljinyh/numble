const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

//models
const User = require("../model/user");
const Register = require("../model/register");
const DOCTOR = require('../model/doctorInfo');
const DOCTORINFO = require('../model/doctorDetail');

module.exports = {
    test: async (req, res) => {
        res.status(200).send({ data: {} });
    },

    // 회원가입
    signup: async (req, res) => {
        //validation
        const UserSchema = Joi.object({
            email: Joi.string()
                .required()
                .pattern(
                    new RegExp("^[0-9a-zA-Z!?_.]+@+[0-9a-zA-Z!?_]+.+[a-zA-Z]$")
                ),
            key: Joi.string()
                .required()
                .pattern(
                    new RegExp("^(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{6,}$")
                ),
        }).unknown();

        let { email, key, name } = await UserSchema.validateAsync(req.body);

        const findEmail = await User.findOne({ email: email });

        if (!findEmail) {
            // password hashing
            key = bcrypt.hashSync(key, 10);

            await User.create({
                email: email,
                key: key,
                name: name,
            });

            const user = await User.findOne({ email: email, name: name });

            const token = JWT.sign({ userId: user.userId },
                process.env.SECRET_KEY, {
                expiresIn: "2d",
            }
            );

            res.status(200).json({
                status: "ok",
                data: {
                    token: token,
                },
            });
        } else {
            return res.status(200).json({
                status: "user_duplicate",
            });
        }
    },

    //회원삭제
    withdrawal: async (req, res) => {
        const { userId } = res.locals.user;
        await User.findByIdAndDelete(userId);
        return res.status(200).json({
            status: "ok",
        });
    },

    //로그인
    signin: async (req, res) => {
        const { email, key } = req.body;
        const findUser = await User.findOne({ email: email });

        if (findUser) {
            const userCompared = await bcrypt.compare(key, findUser.key);

            if (!userCompared) {
                return res.status(400).send({
                    errorMessage: "아이디나 비밀번호가 올바르지 않습니다.",
                });
            } else {
                //비밀번호까지 맞다면 토큰을 생성하기.
                const token = JWT.sign({ userId: findUser.userId },
                    process.env.SECRET_KEY, {
                    expiresIn: "3d",
                }
                );

                return res.status(200).json({
                    status: "ok",
                    data: {
                        token: token,
                    },
                });
            }
        } else {
            return res.status(200).json({
                status: "no_user",
            });
        }
    },

    // 의사정보 가져오기
    doctorList: async (req, res) => {
        const doctor_List = await DOCTOR.find({});

        if (doctor_List) {
            return res.status(200).json({
                status: "ok",
                data: {
                    doctors: doctor_List,
                },
            });
        }
    },

    // 의사상세정보 가져오기
    doctor: async (req, res) => {
        const { doctor_id } = req.query;
        const find_Doctor = await DOCTORINFO.findOne({ doctor_id: doctor_id });

        if (find_Doctor) {
            return res.status(200).json({
                status: "ok",
                data: {
                    doctor: find_Doctor,
                },
            });
        }
    },

    // 검사키트보내기
    register: async (req, res) => {
        const { userId } = res.locals.user;
        const { doctor_id, address, address_code, store_address } = req.body;

        await Register.create({
            doctor_id: doctor_id,
            userId: userId,
            address: address,
            address_code: address_code,
            store_address: store_address,
        });

        return res.status(200).json({
            status: "ok",
        });
    },

    // 의사정보 등록
    doctorPost: async (req, res) => {
        const { doctor_display_name,
            doctor_image_url,
            hospital_name,
            hospital_address,
            description,
            hospital_img } = req.body;

        const findDoctor = await DOCTOR.findOne({ doctor_display_name, hospital_name });
        if (findDoctor) {
            return res.status(200).json({
                status: 'ok',
                message: '이미 있는 정보입니다.'
            });
        } else {
            await DOCTOR.create({
                doctor_display_name: doctor_display_name,
                doctor_image_url: doctor_image_url,
                hospital_name: hospital_name,
                hospital_address: hospital_address,
                description: description,
                hospital_img: hospital_img
            });
            return res.status(200).json({
                status: 'ok',
                message: 'INSERT DOCTOR'
            });
        }
    },

    // 의사 상세정보 등록
    doctorDetailPost: async (req, res) => {
        const {
            doctor_display_name,
            available_hours,
            available_weekday,
            description,
            doctor_image_url,
            doctor_images,
            doctor_tel,
            hospital_addr,
            hospital_name,
            lab_addr,
            lab_name,
            lab_postal_code,
            lab_receiver_name,
            lab_tel,
            lat,
            lng,
            professional_statement,
            subjects
        } = req.body;

        const find_Doctor = await DOCTOR.findOne(doctor_display_name);
        const FindInfo = await DOCTORINFO.findOne({ doctor_display_name });
        if (FindInfo && find_Doctor) {
            return res.status(200).json({
                status: 'ok',
                message: '이미 등록된 정보입니다.'
            });
        } else {
            await DOCTORINFO.create({
                doctor_id: find_Doctor.doctorId,
                available_hours,
                available_weekday,
                description,
                doctor_display_name,
                doctor_image_url,
                doctor_images,
                doctor_tel,
                hospital_addr,
                hospital_name,
                lab_addr,
                lab_name,
                lab_postal_code,
                lab_receiver_name,
                lab_tel,
                lat,
                lng,
                professional_statement,
                subjects
            });

            return res.status(200).json({
                status: 'ok',
                message: 'INSER OK'
            });
        }
    }

};