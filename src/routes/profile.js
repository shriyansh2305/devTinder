const express = require('express');
const {userAuth} = require("../middlewares/auth");
const profileRouter = express.Router();
const validator = require("validator");
const bcrypt = require("bcrypt");
const { validateEditProfileData } = require('../utils/validation');
const user = require('../models/user');
profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try{
        res.send(req.user);
    }catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        // I think we should now allow age to be changes, bcz someone can enter 18+ while signup and change later
        if(!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your profile is updated successfully!!`,
            data: loggedInUser
        });
    }catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

// This is for editing the password when the user is logged in.
// In forgot password, we don't need user to be loggedIn
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try {
        const allowedUpdates = ["oldPassword", "newPassword"];
        const userData = req.body;
        if(Object.keys(userData).length < 2) {
            throw new Error("Missing password fields!!, please provide both old and new passwords")
        }
        // I am not getting that user can provide any type of data, how to handle those many cases?
        // If we always provide data from a form, we are sure that only they will come. 
        // We could exclude this check
        const isUpdateAllowed = Object.keys(userData).every(k => allowedUpdates.includes(k));
        if(!isUpdateAllowed) {
            throw new Error("Only password fields allowed to be updated..");
        }
        const {oldPassword, newPassword} = userData;
        if(oldPassword === newPassword) {
            throw new Error("Please enter a new Password!!");
        }
        const user = req.user;
        const isOldPasswordCorrect = await user.validatePassword(oldPassword);
        if(!isOldPasswordCorrect) {
            throw new Error("Please enter correct old password!!");
        }
        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Enter a strong password");
        }
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        user["password"] = newPasswordHash;
        await user.save();
        res.send("password updated successfuly");
    }catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports = profileRouter;