const express = require("express");

const app = express();




  
app.get("/user/:id/profile", (req, res) => {
    const {id} = req.params
    // res.send(req.query)
    res.send(`id is : ${id} and queried for ${JSON.stringify(req.query)}`)
    // res.send(`id is : ${id} and queried for ${req.query}`)
    // res.send({firstName: "Shriyansh", lastName: "Kumar"});
})

app.post("/user", (req, res) => {
    // send data to the DB
    res.send("The data is saved successfully!");
})

app.delete("/user", (req, res) => {
    res.send("Deleted successfully");
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000...");
});