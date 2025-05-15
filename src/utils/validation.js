const validator = require("validator")

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password} = req.body;
    if(!firstName || !lastName){
        throw new Error("Enter a valid name.");
    }else if(!validator.isEmail(emailId)) {
        throw new Error("Invalid email");
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = ["firstName", "lastName", "age", "gender", "about", "skills", "photoUrl", "email"];
    const userInput = req.body;
    const isEditllowed = Object.keys(userInput).every(field=> allowedEditFields.includes(field));
    return isEditllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}