const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String
    },
    password: {
        type: String
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    }
}, {
    optimisticConcurrency: true // ✅ this enables __v to increment on each change
});

module.exports = mongoose.model("User", userSchema)
