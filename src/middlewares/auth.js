const adminAuth = (req, res, next) => {
    console.log("running admin middleware!!")
    const token = req.query.token
    if(token === "secret") 
        next()
    else 
    res.status(403).send("somethig went wrong")
}

const userAuth = (req, res, next) => {
    console.log("running user middleware!!")
    const password = req.query.password
    // throw new Error("error occured")
    if(password === "12345") {
        next()
    }else{
        res.status(403).send("please enter correct password")
    }
}

module.exports = {
    adminAuth,
    userAuth
}