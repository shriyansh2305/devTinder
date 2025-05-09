const mongoose = require("mongoose")

const connectDB = async () => {
    await mongoose.connect(uri);
};

module.exports = {
    connectDB
}
