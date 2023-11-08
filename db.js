require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.DATABASE_URI;

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("db connected");
    } catch(err) {
        console.log(err.message);
        console.log("cannot connect to db");
    }
};

module.exports = connectToMongo;