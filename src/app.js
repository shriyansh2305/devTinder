const express = require("express");

const app = express();

// This will send the same response for any route
// If we put it at the top, every route will send the same response
// If we place at the end, then the routes which get matched will send their response and then the other will 
// show this as response
// app.use((req, res) => {
//     res.send("Hello from the server")
// })

app.use("/", (req, res) => {
    res.send("Hello from the dashboard")
})
app.use("/test", (req, res) => {
    res.send("Hello from the server")
})
app.use("/hello", (req, res) => {
    res.send("Hello hello hello")
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000...");
});