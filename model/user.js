const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    email: String,
    key: {
        type: String,
        required: true,
        min: 4,
    },
    name: {
        type: String,
        required: true,
    },
});

UserSchema.virtual("userId").get(function() {
    return this._id.toHexString();
});
UserSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("User", UserSchema);