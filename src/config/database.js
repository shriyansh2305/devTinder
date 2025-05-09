const mongoose = require("mongoose")

const uri = "mongodb+srv://shriyansh:shriyansh12345@namastenode.crklcdw.mongodb.net/devTinder";

const connectDB = async () => {
    await mongoose.connect(uri);
};


module.exports = {
    connectDB
}
