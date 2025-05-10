require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database")
const User = require("./models/user");
const user = require("./models/user");
const app = express();
const port = Number(process.env.PORT) || 7777;

app.use(express.json())

app.post("/signup", async (req, res) => {
    
    // create a new instane of User model
    const user = new User(req.body)
    try {
        await user.save()
        res.send("user added successfully!!!")
    } catch(err) {
        res.status(400).send("Error saving the user: " + err.message);
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
// we should have avoided sending email using get req, we can use query params
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await User.findOne({emailId : userEmail})
        if(!user)  res.status(404).send("User not found")
        else res.send(user)
        // const users = await  User.find({emailId : userEmail})
        // if(users.length === 0) res.status(404).send("No users Found!!")
        // res.send(users)
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
// app.patch("/user/:id", async (req, res) => {
//     const id = req.params.id
//     const data = req.body
//     try{
//         const user = await User.findByIdAndUpdate(id, data, {new:true})
//         // By default it sends the prev user, but If we want to get the current user, we need to pass option new:true
//         console.log(user);
//         if(!user)   res.status(404).send("User not found!!")
//         else    res.send("User details updated successfully")
//     }catch(err) {
//         res.status(400).send("something went wrong!!")
//     }
// })

app.patch("/user/:email", async (req, res) => {
    const email = req.params.email
    const data = req.body
    try {
        const user = await User.findOneAndUpdate({emailId: email}, data)
        if(!user)   res.status(404).send("User not found!!")
        else res.send("User updated successfully");
    }catch(err) {
        res.status(400).send("something went wrong!!")
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
