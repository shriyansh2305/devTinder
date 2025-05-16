const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;

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
        // required: true,
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
        type: [String],
        validate: {
            validator: function(value) {
              return Array.isArray(value) && value.every(skill => typeof skill === 'String');
            },
            message: 'Skills must be an array of strings'
        },
        validate: {
            validator: function (val) {
                return val.length <= 10;
            },
            message: "You can add up to 10 skills only.",
        },
    },
    photoUrl: {
        type: String,
        default: "https://www.silcharmunicipality.in/wp-content/uploads/2021/02/male-face.jpg"
    }
 }, 
 { 
    timestamps: true,
 }
);

// If we want to query on both firstName and lastName
userSchema.index({firstName: 1, lastName: 1});
// don't use arrow functions, concept of this is different there
userSchema.methods.getJWT = function() {
    const user = this;
    const token = jwt.sign({ _id: user._id }, jwtSecretKey, { expiresIn: '7d'});
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
