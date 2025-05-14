const express = require("express");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const app = express();

app.use(cookieParser());
const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if(!token) {
            throw new Error("Token is not valid!!");
        }
        const decodedObj = jwt.verify(token, jwtSecretKey);
        const {_id} = decodedObj;
        const user = await User.findById(_id);
        if(!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
    
}

module.exports = {
    userAuth
}