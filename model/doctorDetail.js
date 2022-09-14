const mongoose = require('mongoose');

const DoctorDetailSchema = mongoose.Schema({
    doctor_id: String,
    available_hours: String,
    available_weekday: String,
    description: String,
    doctor_display_name: String,
    doctor_image_url: String,
    doctor_images: {
        url: [String],
    },
    doctor_tel: String,
    hospital_addr: String,
    hospital_name: String,
    lab_addr: String,
    lab_name: String,
    lab_postal_code: String,
    lab_receiver_name: String,
    lab_tel: String,
    lat: String,
    lng: String,
    professional_statement: String,
    subjects: String
});

DoctorDetailSchema.virtual("DoctorDetialId").get(function () {
    return this._id.toHexString();
});
DoctorDetailSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("DoctorDetial", DoctorDetailSchema);