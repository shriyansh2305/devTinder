const express = require('express');
const {userAuth} = require('../middlewares/auth');
const ConnetionRequest = require("../models/connectionRequest");
const userRouter = express.Router();
const user_safe_data = process.env.USER_SAFE_DATA;
const User = require("../models/user")

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
});

userRouter.get("/feed", userAuth, async (req, res) => {
    try {
        // user should see all the user cards except:
        // 0. own card
        // his connections
        // ignored people
        // already sent the connection req
        // or combinely: if there is any connection where this user is involved as either sender or receiver and with any status
        let { page, pageSize } = req.query;
        // If "page" and "pageSize" are not sent, we will default them to 1 and 5.
        page = parseInt(page, 10) || 1;
        pageSize = parseInt(pageSize, 10) || 10;
        pageSize = pageSize > 50 ? 50 : pageSize;
        
        const loggedInUser = req.user;
        // find all connnectionRequests (sent+received)
        const connectionRequests = await ConnetionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        })
        .select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req =>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        }); 
        console.log(hideUsersFromFeed);
        const feedUsers = await User.find({
            $and:[
                {_id: {$nin: Array.from(hideUsersFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        })
        .select(user_safe_data)
        .limit(pageSize)
        .skip((page - 1) * pageSize);;
        res.json({ data: feedUsers });
    }catch(err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = userRouter;
