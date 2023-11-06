require("dotenv").config();
const express = require("express");
const connectToMongo = require("./db");

const app = express();
const port = parseInt(process.env.API_PORT);

// Connecting to MongoDB
connectToMongo();

// Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

// Starting the server
app.listen(port, () => {
    console.log("server started");
});