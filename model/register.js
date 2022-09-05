const mongoose = require("mongoose");

const registerSchema = mongoose.Schema({
    userId: String,
    doctor_id: String,
    address: String,
    address_code: String,
    store_address: String,
});

registerSchema.virtual("registerId").get(function() {
    return this._id.toHexString();
});
registerSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("register", registerSchema);