const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

// Create a user: "POST /api/auth/". Doesn't require auth
router.post("/",[
    body("email", "Please enter a valid email.").isEmail().custom(async (value) => {
        const user = await User.findOne({email: value});
        if(user){
            return Promise.reject("Email already in use.");
        }
    }),
    body("name", "Length of name must be atleast 5 characters.").isLength({min: 5}),
    body("password", "Password must be atleast 6 characters long.").isLength({min: 6})
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        });
        res.json(user);
    } catch(err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;