require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const port = Number(process.env.PORT) || 7777;
const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request")


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


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

