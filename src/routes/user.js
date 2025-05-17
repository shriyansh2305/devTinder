const express = require('express');
const {userAuth} = require('../middlewares/auth');
const ConnetionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const user_safe_data = process.env.USER_SAFE_DATA;


// get all the pending connection requests for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requests = await ConnetionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        })
        // .populate("fromUserId", ["firstName", "lastName", "age", "gender", "skills", "about"]);
        .populate("fromUserId", "firstName lastName age gender skills about");
        res.json({
            message: "The connections are fetched successfully",
            data: requests
        });

    }catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

// get all the connected connections for a loggedIn user
userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnetionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"}
            ]
        })
        .populate("fromUserId", user_safe_data)
        .populate("toUserId", user_safe_data);
        const data = connectionRequests.map((row) => {
            if(row.fromUserId._id.equals(loggedInUser._id)) {
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({
            message: "The connections are fetched successfully!!",
            data
        });
    }catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
})

module.exports = userRouter;
