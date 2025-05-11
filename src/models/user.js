const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 30,
        minLength: 4
    },
    lastName: {
        type: String,
        maxLength: 20
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
    },
    age: {
        type: Number,
        required: true,
        min: 18
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"],
    },
    about: {
        type: String,
        default: "This is the default about!!",
        maxLength: 100,
    },
    skills: {
        type: [String]
    },
    photoUrl: {
        type: String,
        default: "https://www.silcharmunicipality.in/wp-content/uploads/2021/02/male-face.jpg"
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema)
