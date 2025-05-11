require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user");
const validator = require("validator");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt")
const app = express();
const port = Number(process.env.PORT) || 7777;


app.use(express.json())

app.post("/signup", async (req, res) => {
    
    try {
        // validate the user signup data
        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;

        // encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);
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
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(isValidPassword) {
            res.send("Login Successfull!!");
        }else {
            throw new Error("Invalid Credentials");
        }
    }catch(err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

// feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
    try {
        const allUsers = await User.find({})
        if(allUsers.length === 0)   res.status(404).send("No users found!!")
        res.send(allUsers)
    } catch(err) {
        res.status(400).send("Something went wrong!!")
    }
})
// get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const users = await  User.find({emailId : userEmail})
        if(users.length === 0) res.status(404).send("No users Found!!")
        res.send(users)
    } catch(err) {
        res.status(400).send("Something went wrong!!")
    } 
})

// get user by id
app.get("/user/:id", async (req, res) => {
    const id = req.params.id
    try{
        const user = await User.findById(id)
        if(!user)   res.status(404).send("User not found!!")
        else res.send(user)
    } catch(err) {
        res.status(400).send("something went wrong!!")
    }
})

// delete a user from database
app.delete("/user/:id", async (req, res) => {
    const userId = req.params.id
    try {
        const deletedUser = await User.findByIdAndDelete(userId)
        if(!deletedUser)   res.status(404).send("User not found!!");
        else res.send(`User with id ${userId} deleted successfully`)
    } catch(err) {
        res.status(400).send("something went wrong!!")
    }
})

// update data of a user
app.patch("/user/:userId", async (req, res) => {
    const userId = req.params?.userId
    const data = req.body
    try{
        // API-level check for max 10 skills
        if (data?.skills?.length > 10) {
            throw new Error("Only 10 skills allowed")
        }
        const ALLOWED_UPDATES = [
            "password", "gender", "about", "skills", "photoUrl"
        ]
        const requestedUpdates = Object.keys(data);
        console.log(requestedUpdates);
        
        const isUpdateAllowed = requestedUpdates.every((k) => ALLOWED_UPDATES.includes(k))
        // every return true, when all the cases inisde it returns true
        // if any case fails, .every return false
        if(!isUpdateAllowed) {
            throw new Error("Update not allowed ")
        }
        const user = await User.findByIdAndUpdate(userId, data, {new:true, runValidators: true})
        if(!user)   res.status(404).send("User not found!!")
        else    res.send("User details updated successfully")
    }catch(err) {
        res.status(400).send("Update failed : " + err.message)
    }
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

