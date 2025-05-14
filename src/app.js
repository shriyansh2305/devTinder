require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user");
const validator = require("validator");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const {userAuth} = require("./middlewares/auth")

const port = Number(process.env.PORT) || 7777;


const app = express();

app.use(express.json())
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    
    try {
        // validate the user signup data
        validateSignUpData(req);
        
        const {firstName, lastName, emailId, password} = req.body;
        
        // encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        // save the data to database
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });
        await user.save();
        res.send("user added successfully!!!");
    } catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

app.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if(!validator.isEmail(emailId)) {
            throw new Error("Invalid Credentials");
        }
        const user = await User.findOne({ emailId : emailId });
        
        if(!user) {
            throw new Error("Invalid Credentials");
        }
        const isValidPassword = await user.validatePassword(password);
        console.log(typeof isValidPassword);
        
        if(isValidPassword) { 
            // create a JWT token
            const token = user.getJWT();
            console.log(typeof token);
            // add the token to cookie and send back the cookie to the user
            res.cookie("token", token, {
                expires: new Date(Date.now() + 24 * 7 * 3600000),
                httpOnly: true 
            });
            res.send("Login Successfull!!");
        }else {
            throw new Error("Invalid Credentials");
        }
    }catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

// Profile API
app.get("/profile", userAuth, async (req, res) => {
    try{
        res.send(req.user);
    }catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
 });

app.post("/sendNewConnectionRequest", userAuth, (req, res) => {
    const user = req.user
    res.send(user.firstName + " sent the connection request!!")
})


connectDB()
    .then(() => {
        console.log("Database connection estabished..")
        app.listen(port, () => {
            console.log("Server is successfully listening on port 7777...");
            
        })
    })
    .catch((err) => {
        console.log("Database cannot be established!!" + err.message);
    })

