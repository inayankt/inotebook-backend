require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.DATABASE_URI;

const connectToMongo = async () => {
    await mongoose.connect(mongoURI);
    console.log("db connected");
};

module.exports = connectToMongo;