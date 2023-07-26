const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicUrl: {
        type: String,
        default: "https://res.cloudinary.com/instagramcloneapp/image/upload/v1633881327/picture-not-available_wb3gtb.jpg"
    },
    followers: [{ type: ObjectId, ref: "Users" }],
    following: [{ type: ObjectId, ref: "Users" }]
});

module.exports = mongoose.model("Users", userSchema);