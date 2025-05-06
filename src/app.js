const express = require("express");

const {adminAuth, userAuth} = require("./middlewares/auth")
const app = express();

// initially there is no error, it does not enter this route
app.use("/", (err, req, res, next) => {
    console.log("inside /")
    if(err) {
        res.send("Some error occured!!")
    }
})
app.use("/admin", adminAuth)
// app.use("/user", userAuth)

app.get("/admin/getAllUsers", (req, res) => {
    try {
        // logic to get all users
        res.send("Fetched all users")
    }catch {
        throw new Error("error")
    }
})

app.delete("/admin/deleteUser", (req, res) => {
    try {
        // logic to delete a user
        res.send("Deleted user")
    }catch {
        throw new Error("error")
    }
})
// no need of auth middleware here
app.use("/user/login", (req, res) => {
    res.send("user logged in successfully")
})
app.get("/user/profile", userAuth, (req, res) => {
    try {
        res.send("Hii user")
    }catch {
        throw new Error("error")
    }
})

// wildcard to handle any type of error, which we could have missed
app.use("/", (err, req, res, next) => {
    console.log("inside last /"); 
    if(err) {
        res.send("Some error occured!!")
    }
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000...");
});