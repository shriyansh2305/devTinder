const express = require("express");

const app = express();


app.get("/user", 
    (req, res, next) => {
        // res.send("response!!")
        console.log("rh1");
        next()
    }, 
    (req, res, next) => {
        console.log("rh2");
        // res.send("response2!!")
        next();
    }
)
app.get("/user", 
    [(req, res, next) => {
        console.log("rh3");
        // res.send("response3!!")
        next()
    }, 
    (req, res, next) => {
        console.log("rh4");
        // next()
        res.send("response4!!")
    }]
)

app.listen(3000, () => {
    console.log("Server is listening on port 3000...");
});