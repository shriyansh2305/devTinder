const mongoose = require("mongoose")

const uri = "mongodb+srv://shriyansh:Kolkata123456@namastenode.crklcdw.mongodb.net/devTinder";

const connectDB = async () => {
    await mongoose.connect(uri);
};


module.exports = {
    connectDB
}
