const express = require('express');
const {userAuth} = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user")

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // If user tries to send himself, we can also use a pre hook
        // if(fromUserId.equals(toUserId)) {
        //     throw new Error("You can not send request to yourself!!");
        // }
        const allowedStatus = ["interested", "ignored"];
        if(!allowedStatus.includes(status)) {
            throw new Error(`status: ${status} is not allowed!!`);
        }
        // check if toUserId exists or its just a random valid id
        const toUser = await User.findById(toUserId);
        if(!toUser) {
            throw new Error("This user does not exist!!");
        }
        // check if there is an existing connection request
        const existingConnectionRequest = await ConnectionRequest.findOne({ 
            $or: [ 
                { toUserId, fromUserId}, 
                { toUserId: fromUserId, fromUserId: toUserId} 
            ] 
        });
        if(existingConnectionRequest) {
            throw new Error("Connection request already exists");
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        const data = await connectionRequest.save();
        let message;
        if(status=="interested") {
            message = `${req.user.firstName} is interested in ${toUser.firstName}`;
        }else{
            message = `${req.user.firstName} ignored ${toUser.firstName}`;
        }
        res.json({
            message,
            data,
        });
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;
        // status should be accepted or rejected
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)) {
            throw new Error("status is not valid!!");
        };
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        });
        // requestId should be valid
        // toUserId should be same as loggedInUser
        // status should be "interested"
        if(!connectionRequest) {
            throw new Error("No valid connection request found!!");
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({
            message: "Connection request "  + status,
            data
        });
    }catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
});

module.exports = requestRouter;
