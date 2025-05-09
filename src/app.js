const express = require("express");
const {connectDB} = require("./config/database")
const User = require("./models/user")
const app = express();


app.post("/signup", async (req, res) => {
    const userObj = {
        firstName: "virendra",
        lastName: "sehwag",
        emailId: "virendra@kohli.com",
        password: "shri12345"
    }
    // create a new instane of User model
    const user = new User(userObj)
    try {
        await user.save()
        console.log(user.__v);        
        user.password = "sehwag123"
        await user.save()
        console.log(user.__v);
        res.send("user added successfully!!")
    } catch(err) {
        res.status(400).send("Error saving the user: " + err.message);
    }
});


connectDB()
    .then(() => {
        console.log("Database connection estabished..")
        app.listen(7777, () => {
            console.log("Server is successfully listening on port 7777...");
            
        })
    })
    .catch((err) => {
        console.log("Database cannot be established!!");
    })





// My code: 
// async function connectDB() {
//     try {
//         await mongoose.connect(uri)
//         console.log("Connected to DB...");
//         app.listen(7777, () => {
//             console.log("Server is listening on port 3000...");
//         })
//     } catch(err) {
//         console.log(err)
//     }
// }
// const userSchema = mongoose.Schema({
//     firstName: String,
//     lastName: String,
//     age: Number,
//     email: String
// })
// const User = mongoose.model('User', userSchema)

// app.post("/signup", async (req, res) => {
//     const data = {
//         firstName: "mno", 
//         lastName: "Kumar",
//         age: 22, 
//         email: "ss23@gamil.com"
//     }
//     const response = await User.create(data)
//     console.log(response);
    
//     res.send("user created")
// })
// connectDB()
