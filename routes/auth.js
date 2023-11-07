const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const jwt_secret = process.env.JWT_SECRET;

// Create a user: "POST /api/auth/register". Doesn't require auth.
router.post("/register", [
    body("email", "Please enter a valid email.").isEmail().custom(async (value) => {
        try {
            const user = await User.findOne({email: value});
            if(user){
                return Promise.reject("Email already in use.");
            }
        } catch(err) {
            // This error occurs when database is not connected. We here resolve the validation so that we can handle the error and send proper response.
            return Promise.resolve();
        }
    }),
    body("name", "Length of name must be atleast 5 characters.").isLength({min: 5}),
    body("password", "Password must be atleast 6 characters long.").isLength({min: 6})
], async (req, res) => {
    // If there are errors, return bad request and the errors array.
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ status: "error", message: errors.array()[0].msg });
    }
    // If no errors found.
    try {
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(req.body.password, salt);
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: pass,
        });
        const data = {
            user: {
                id: user._id
            }
        };
        const authToken = jwt.sign(data, jwt_secret);
        res.status(200).json({status: "success", message: "User successfully created.", authToken: authToken});
    } catch(err) {
        console.log(err.message);
        res.status(500).json({status: "error", message: "Some internal error occurred."});
    }
});

module.exports = router;