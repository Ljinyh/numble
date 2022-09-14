const mongoose = require('mongoose');

const DoctorSchema = mongoose.Schema({
    doctor_display_name: String,
    doctor_image_url: String,
    hospital_name: String,
    hospital_address: String,
    description: String,
    hospital_img: String
});

DoctorSchema.virtual("doctorId").get(function () {
    return this._id.toHexString();
});
DoctorSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Doctor", DoctorSchema);