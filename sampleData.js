class sampleData {
    static #doctors = [{
        id: 'test',
        doctor_display_name: '윈터',
        doctor_image_url: 'https://photo.newsen.com/mphoto/2022/06/24/202206241807463510_1.jpg',
        hospital_name: 'SM 엔터테인먼트',
        hospital_address: '서울특별시 성동구 왕십리로 83-21 에스엠엔터테인먼트',
        description: '안녕하세요!',
        hospital_img: 'https://search.pstatic.net/common/?autoRotate=true&quality=95&type=w750&src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20210809_254%2F1628490646641wLE0B_JPEG%2FOYFVJ_qgIB14KM3Zz8AIhJxF.jpg',
    },];

    static #doctor = {
        doctor_id: 'test',
        available_hours: '언제든 가능합니다.',
        available_weekday: '아무때나 진료 가능.',
        description: '안녕하세요!?',
        doctor_display_name: '윈터',
        doctor_image_url: 'https://photo.newsen.com/mphoto/2022/06/24/202206241807463510_1.jpg',
        doctor_images: JSON.stringify([{
            type: 1,
            url: 'https://photo.newsen.com/mphoto/2022/06/24/202206241807463510_1.jpg',
        },]),
        doctor_tel: '01023456789',
        hospital_addr: '서울특별시 성동구 왕십리로 83-21 에스엠엔터테인먼트',
        hospital_name: 'SM 엔터테인먼트',
        lab_addr: '서울특별시 성동구 왕십리로 83-21 에스엠엔터테인먼트',
        lab_name: 'SM 엔터테인먼트',
        lab_postal_code: '123456',
        lab_receiver_name: '윈터',
        lab_tel: '01023456789',
        lat: '37.5443766',
        lng: '127.043793',
        professional_statement: '음반, 기획',
        subjects: '에스파',
    };

    static GetDoctors(...fields) {
        const doctors = this.doctors;
        const newDoctors = fields.reduce((newDoctors, field) => {
            if (doctors.hasOwnProperty(field)) {
                newDoctors[field] = doctors[field];
            }
            return newDoctors;
        }, {});
        return newDoctors;
    }

    static GetDoctor() {
        const doctor = this.doctor;
        const newDoctor = fields.reduce((newDoctor, field) => {
            if (doctor.hasOwnProperty(field)) {
                newDoctor[field] = doctor[field];
            }
            return newDoctor;
        }, {});
        return newDoctor;
    }
}

module.exports = sampleData;