const express = require("express");

const app = express();

app.get("/user", (req, res) => {
    res.send({firstName: "Shriyansh", lastName: "Kumar"});
})

app.post("/user", (req, res) => {
    // send data to the DB
    res.send("The data is saved successfully!");
})

app.delete("/user", (req, res) => {
    res.send("Deleted successfully");
})


// This ".use" matches all the HTTP method api call to /user
// app.use("/user", (req, res) => {
//     res.send("Hello from the server")
// })

// This matches any route which has "/", after that what ever is there, it doessn't matter.
// the order or routes are very important, if we will keep this at the top, all the routes will use this.
// app.use("/", (req, res) => {
//     res.send("Hello from the dashboard")
// })
app.listen(3000, () => {
    console.log("Server is listening on port 3000...");
});