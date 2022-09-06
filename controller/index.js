const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Joi = require("joi");

//models
const User = require("../model/user");
const Register = require("../model/register");

module.exports = {
    test: async(req, res) => {
        res.status(200).send({ data: {} });
    },

    // 회원가입
    signup: async(req, res) => {
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
    withdrawal: async(req, res) => {
        const { userId } = res.locals.user;
        await User.findByIdAndDelete(userId);
        return res.status(200).json({
            status: "ok",
        });
    },

    //로그인
    signin: async(req, res) => {
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

    doctorList: async(req, res) => {
        //sample data
        const doctors = [{
            id: "test",
            doctor_display_name: "윈터",
            doctor_image_url: "https://photo.newsen.com/mphoto/2022/06/24/202206241807463510_1.jpg",
            hospital_name: "SM 엔터테인먼트",
            hospital_address: "서울특별시 성동구 왕십리로 83-21 에스엠엔터테인먼트",
            description: "안녕하세요!",
            hospital_img: "https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210809_254%2F1628490646641wLE0B_JPEG%2FOYFVJ_qgIB14KM3Zz8AIhJxF.jpg",
        }, ];

        // const doctor_List = await Info.find({});

        // if (doctor_List) {
        return res.status(200).json({
            status: "ok",
            data: {
                doctors: doctors,
            },
        });
        // }
    },

    doctor: async(req, res) => {
        //sample data
        const doctor = {
            doctor_id: "test",
            available_hours: "언제든 가능합니다.",
            available_weekday: "아무때나 진료 가능.",
            description: "안녕하세요!?",
            doctor_display_name: "윈터",
            doctor_image_url: "https://photo.newsen.com/mphoto/2022/06/24/202206241807463510_1.jpg",
            doctor_images: JSON.stringify([{
                type: 1,
                url: "https://photo.newsen.com/mphoto/2022/06/24/202206241807463510_1.jpg",
            }, ]),
            doctor_tel: "01023456789",
            hospital_addr: "서울특별시 성동구 왕십리로 83-21 에스엠엔터테인먼트",
            hospital_name: "SM 엔터테인먼트",
            lab_addr: "서울특별시 성동구 왕십리로 83-21 에스엠엔터테인먼트",
            lab_name: "SM 엔터테인먼트",
            lab_postal_code: "123456",
            lab_receiver_name: "윈터",
            lab_tel: "01023456789",
            lat: "37.5443766",
            lng: "127.043793",
            professional_statement: "음반, 기획",
            subjects: "에스파",
        };

        return res.status(200).json({
            status: "ok",
            data: {
                doctor: doctor,
            },
        });
    },

    register: async(req, res) => {
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
};