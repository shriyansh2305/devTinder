const express = require('express');
const {userAuth} = require("../middlewares/auth");
const requestRouter = express.Router();

requestRouter.post("/sendNewConnectionRequest", userAuth, (req, res) => {
    const user = req.user;
    res.send(user.firstName + " sent the connection request!!");
});

module.exports = requestRouter;
